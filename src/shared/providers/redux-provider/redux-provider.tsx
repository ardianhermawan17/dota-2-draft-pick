'use client'
import {Provider} from "react-redux";
import React, { useRef} from "react";
import type {AppStore} from "@shared/config/redux/store";
import { makeStore, persistor} from "@shared/config/redux/store";
import {PersistGate} from "redux-persist/integration/react";

export const ReduxProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const storeRef = useRef<AppStore>(undefined)
    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    return (
        // eslint-disable-next-line react-hooks/refs
        <Provider store={storeRef.current}>
            <PersistGate
                loading={false}
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    )
}
