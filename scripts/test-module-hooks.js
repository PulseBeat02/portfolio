import {readFileSync, statSync} from "node:fs";
import {register} from "node:module";
import {fileURLToPath, pathToFileURL} from "node:url";
import {isMainThread} from "node:worker_threads";
import ts from "typescript";

const SOURCE_ALIAS_PREFIX = "@/";
const SOURCE_DIRECTORY_URL = new URL("../src/", import.meta.url);
const SOURCE_FILE_SUFFIXES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

const MODULE_NOT_FOUND_CODE = "ERR_MODULE_NOT_FOUND";
const PACKAGE_FILE_EXTENSION = ".js";

const TSX_FILE_EXTENSION = ".tsx";
const TSX_SOURCE_ENCODING = "utf8";
const TSX_COMPILER_OPTIONS = {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext};

function isFile(path) {
    return statSync(path, {throwIfNoEntry: false})?.isFile() ?? false;
}

function resolveSourceAlias(specifier) {
    const sourcePath = fileURLToPath(new URL(specifier.slice(SOURCE_ALIAS_PREFIX.length), SOURCE_DIRECTORY_URL));
    const sourceFilePath = SOURCE_FILE_SUFFIXES.map((suffix) => sourcePath + suffix).find(isFile);
    return sourceFilePath ? pathToFileURL(sourceFilePath).href : specifier;
}

function isBarePackageSpecifier(specifier) {
    return !specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.includes(":");
}

export async function resolve(specifier, context, nextResolve) {
    const resolvedSpecifier = specifier.startsWith(SOURCE_ALIAS_PREFIX) ? resolveSourceAlias(specifier) : specifier;
    try {
        return await nextResolve(resolvedSpecifier, context);
    } catch (exception) {
        if (exception.code !== MODULE_NOT_FOUND_CODE || !isBarePackageSpecifier(resolvedSpecifier)) throw exception;
        // next has no exports map, so next/server only resolves by its file name outside the Next.js bundler
        return nextResolve(resolvedSpecifier + PACKAGE_FILE_EXTENSION, context);
    }
}

export async function load(url, context, nextLoad) {
    if (!url.endsWith(TSX_FILE_EXTENSION)) return nextLoad(url, context);
    const sourcePath = fileURLToPath(url);
    const {outputText} = ts.transpileModule(readFileSync(sourcePath, TSX_SOURCE_ENCODING), {
        fileName: sourcePath,
        compilerOptions: TSX_COMPILER_OPTIONS,
    });
    return {format: "module", source: outputText, shortCircuit: true};
}

// asynchronous hooks leave CommonJS packages to require, which loads their ES module dependencies; registerHooks cannot
if (isMainThread) register(import.meta.url);
