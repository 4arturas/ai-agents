const { createContext, useState } = React;

const AppContext = createContext({
    activeTab: "1",
    problem: "",
    setProblem: () => {},
});