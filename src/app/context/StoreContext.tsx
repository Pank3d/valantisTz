import React from "react";
import brandStore from "../../enteties/card/store/brandStore";

export const StoreContext  = React.createContext({
    brandStore
})

export const StoreProvider:React.FC<{children:React.ReactNode}> = ({
    children
}) => {
    return (
        <StoreContext.Provider value={{brandStore}}>
            {children}
        </StoreContext.Provider>
    )
}