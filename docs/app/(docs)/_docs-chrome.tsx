// app/(docs)/_docs-chrome.tsx - the persistent, interactive docs shell (client component).
"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocsSearchProvider, DocsNavbar, DocsTabs, DocsSidebar } from "@daanvandenbergh/scribekit/react";
import type { NavTree } from "@daanvandenbergh/scribekit";
import { BaseImg } from "./_docs-image";

export function DocsChrome({ nav, children }: { nav: NavTree; children: ReactNode }) {
    const activePath = usePathname();
    return (
        <DocsSearchProvider nav={nav} linkComponent={Link}>
            <div className="scribekit-docs">
                {/* The logo is the bare mark on the brand ramp (no tile) - the navbar supplies its own
                    white ground. `BaseImg` so it resolves under a project-site base path. */}
                <DocsNavbar
                    logo={<BaseImg src="/assets/logo-mark.svg" alt="" width={22} height={22} style={{ display: "block" }} />}
                    brandName="Claudekit"
                    docsText="Docs"
                    linkComponent={Link}
                />
                <DocsTabs nav={nav} activePath={activePath} linkComponent={Link} />
                <div className="scribekit-docs-body">
                    <DocsSidebar nav={nav} activePath={activePath} linkComponent={Link} />
                    <main className="scribekit-docs-main">{children}</main>
                </div>
            </div>
        </DocsSearchProvider>
    );
}
