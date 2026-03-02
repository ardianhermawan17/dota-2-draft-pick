'use client'
import {Provider} from "react-redux";
import React, { useRef} from "react";
import type {AppStore} from "@shared/config/redux/store";
import { makeStore} from "@shared/config/redux/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

export const ReduxProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const storeRef = useRef<AppStore | null>(null);
    // eslint-disable-next-line
    const persistorRef = useRef<any>(null);

    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        const store = makeStore();
        storeRef.current = store;
        // eslint-disable-next-line react-hooks/refs
        persistorRef.current = persistStore(store);
    }

    return (
        // eslint-disable-next-line react-hooks/refs
        <Provider store={storeRef.current}>
            <PersistGate
                loading={false}
                // eslint-disable-next-line react-hooks/refs
                persistor={persistorRef.current}
            >
                {children}
            </PersistGate>
        </Provider>
    )
}
