import React from 'react';
import {ShadcnProvider} from "@shared/providers/shadcn-provider";
import {ReduxProvider} from "@shared/providers/redux-provider";

/* HOC Component untuk wrapper disini ya, seperti shadcn */

export const LibraryProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ReduxProvider>
            <ShadcnProvider>
                {children}
            </ShadcnProvider>
        </ReduxProvider>
    )
}