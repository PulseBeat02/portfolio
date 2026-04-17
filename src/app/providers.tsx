"use client";

import React from "react";
import ThemeRegistry from "@/app/registry";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeRegistry>
            {children}
        </ThemeRegistry>
    );
}