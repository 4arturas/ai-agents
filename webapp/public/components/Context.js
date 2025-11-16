// Create a React context to manage application state
const AppContext = React.createContext();
window.AppContext = AppContext; // Make it globally available

// Component to demonstrate context usage
function ContextConsumer() {
    const { appContext, setAppContext } = React.useContext(AppContext);

    return (
        <div>
            <p>Current active tab: {appContext.activeTabKey}</p>
            <button onClick={() => {
                setAppContext({ ...appContext, demoMessage: "Context updated!" });
            }}>
                Update Context
            </button>
            {appContext.demoMessage && <p>{appContext.demoMessage}</p>}
        </div>
    );
}

// Net tab component
function NetTab() {
    return (
        <div>
            <h2>Net Tab</h2>
            <p>This is the net tab content with React context functionality.</p>

            {/* Example of using context to share data */}
            <ContextConsumer />
        </div>
    );
}