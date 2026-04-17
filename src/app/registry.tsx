"use client";

import React, {useState} from "react";
import {useServerInsertedHTML} from "next/navigation";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/app/theme";

export default function ThemeRegistry({children}: { children: React.ReactNode }) {
    const [cache] = useState(() => {
        const c = createCache({key: "mui"});
        c.compat = true;
        return c;
    });

    useServerInsertedHTML(() => {
        const names = Object.keys(cache.inserted);
        if (names.length === 0) return null;

        let styles = "";
        const dataEmotionAttribute = cache.key;

        const globals: string[] = [];
        for (const name of names) {
            const style = cache.inserted[name];
            if (typeof style === "string") {
                if (style.startsWith("/*")) {
                    globals.push(style);
                } else {
                    styles += `.${cache.key}-${name}{${style}}`;
                }
            }
        }
        cache.inserted = {};

        const elements: React.ReactNode[] = [];
        if (globals.length > 0) {
            elements.push(
                <style
                    key="globals"
                    data-emotion={`${dataEmotionAttribute}-global`}
                    dangerouslySetInnerHTML={{__html: globals.join("")}}
                />
            );
        }

        if (styles.length > 0) {
            elements.push(
                <style
                    key="styles"
                    data-emotion={dataEmotionAttribute}
                    dangerouslySetInnerHTML={{__html: styles}}
                />
            );
        }
        return <>{elements}</>;
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
