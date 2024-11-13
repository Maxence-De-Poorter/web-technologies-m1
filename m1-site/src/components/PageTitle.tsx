// PageTitle component to render a centered title at the top of a page
import React from "react";

export default function PageTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center mt-10">
            {/* Main title text, large and bold */}
            <h1 className="text-7xl font-bold mb-4">{children}</h1>
        </div>
    )
}