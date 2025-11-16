const { useState } = React;
const { Input, Button, Card, Space } = antd;
const { TextArea } = Input;

function CognitiveLoop() {
    const { appContext, setAppContext } = React.useContext(AppContext);
    const { problem } = appContext;
    const setProblem = (problem) => {
        setAppContext(prev => ({ ...prev, problem }));
    };

    const [observeResponse, setObserveResponse] = useState("");
    const [thinkResponse, setThinkResponse] = useState("");
    const [decideResponse, setDecideResponse] = useState("");
    const [learnResponse, setLearnResponse] = useState("");
    const [pastActions, setPastActions] = useState([]);
    const [loading, setLoading] = useState({
        observe: false,
        think: false,
        decide: false,
        learn: false
    });


    // Function to call Ollama API
    const callOllama = async (prompt) => {
        try {
            const response = await fetch('/api/callOllama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error calling Ollama:", error);
            return "Error: Could not get response from Ollama";
        }
    };

    const handleObserve = async () => {
        if (!problem) return;
        setLoading(prev => ({ ...prev, observe: true }));
        const observe = `
        You are an AI agent.
        Your goal is: ${problem}.
        Your past actions: ${JSON.stringify(pastActions)}.
        Please analyze the current situation and provide information to help achieve the goal.

        FORMAT YOUR RESPONSE AS:
        **Key Observations:**
        - Observation 1
        - Observation 2

        **Relevant Information:**
        - Detail 1
        - Detail 2
        `;
        const response = await callOllama(observe);
        setObserveResponse(response);
        setPastActions(prev => [...prev, { action: 'observe', response }]);
        setLoading(prev => ({ ...prev, observe: false }));
    };

    const handleThink = async () => {
        if (!observeResponse) return;
        setLoading(prev => ({ ...prev, think: true }));
        const thinkPrompt = `
        Based on this observation: ${observeResponse}.
        Your goal is: ${problem}.
        Your past actions: ${JSON.stringify(pastActions)}.
        Please think through the best next step to achieve the goal.

        FORMAT YOUR RESPONSE AS:
        **Thought Process:**
        - Consideration 1
        - Consideration 2

        **Next Steps:**
        - Option 1
        - Option 2
        `;
        const response = await callOllama(thinkPrompt);
        setThinkResponse(response);
        setPastActions(prev => [...prev, { action: 'think', response }]);
        setLoading(prev => ({ ...prev, think: false }));
    };

    const handleDecide = async () => {
        if (!thinkResponse) return;
        setLoading(prev => ({ ...prev, decide: true }));
        const decidePrompt = `
        Based on this thought: ${thinkResponse}.
        Your goal is: ${problem}.
        Your past actions: ${JSON.stringify(pastActions)}.
        Available actions are: observe, think, decide, learn.

        FORMAT YOUR RESPONSE AS:
        **Decision:**
        - Selected action: [action name]

        **Reasoning:**
        - Reason 1
        - Reason 2

        **Expected Outcome:**
        - Outcome 1
        `;
        const response = await callOllama(decidePrompt);
        setDecideResponse(response);
        setPastActions(prev => [...prev, { action: 'decide', response }]);
        setLoading(prev => ({ ...prev, decide: false }));
    };

    const handleLearn = async () => {
        if (!decideResponse) return;
        setLoading(prev => ({ ...prev, learn: true }));
        const learnPrompt = `
        From this action: ${decideResponse}.
        Your goal was: ${problem}.
        Your past actions: ${JSON.stringify(pastActions)}.
        Please identify any patterns or lessons that could be useful for achieving similar goals in the future.

        FORMAT YOUR RESPONSE AS:
        **Key Lessons:**
        - Lesson 1
        - Lesson 2

        **Patterns Identified:**
        - Pattern 1
        - Pattern 2

        **Future Recommendations:**
        - Recommendation 1
        `;
        const response = await callOllama(learnPrompt);
        setLearnResponse(response);
        setPastActions(prev => [...prev, { action: 'learn', response }]);
        setLoading(prev => ({ ...prev, learn: false }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Cognitive Loop</h2>

            <Card title="Problem Input" style={{ marginBottom: '20px' }}>
                <TextArea
                    placeholder="Enter your problem here..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                />
            </Card>

            <Space wrap style={{ marginBottom: '20px' }}>
                <Button
                    type="primary"
                    onClick={handleObserve}
                    loading={loading.observe}
                    disabled={!problem}
                >
                    Observe
                </Button>
                <Button
                    type="primary"
                    onClick={handleThink}
                    loading={loading.think}
                    disabled={!observeResponse}
                >
                    Think
                </Button>
                <Button
                    type="primary"
                    onClick={handleDecide}
                    loading={loading.decide}
                    disabled={!thinkResponse}
                >
                    Decide
                </Button>
                <Button
                    type="primary"
                    onClick={handleLearn}
                    loading={loading.learn}
                    disabled={!decideResponse}
                >
                    Learn
                </Button>
            </Space>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <Card
                    title="Observe"
                    loading={loading.observe && !observeResponse}
                    style={{ minHeight: '200px' }}
                >
                    {observeResponse && <div>{observeResponse}</div>}
                </Card>
                <Card
                    title="Think"
                    loading={loading.think && !thinkResponse}
                    style={{ minHeight: '200px' }}
                >
                    {thinkResponse && <div>{thinkResponse}</div>}
                </Card>
                <Card
                    title="Decide"
                    loading={loading.decide && !decideResponse}
                    style={{ minHeight: '200px' }}
                >
                    {decideResponse && <div>{decideResponse}</div>}
                </Card>
                <Card
                    title="Learn"
                    loading={loading.learn && !learnResponse}
                    style={{ minHeight: '200px' }}
                >
                    {learnResponse && <div>{learnResponse}</div>}
                </Card>
            </div>
        </div>
    );
}