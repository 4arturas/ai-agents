// Cognitive Loop component
function CognitiveLoop() {
    const { TextArea, Button, Card, Space } = antd;
    const { useState } = React;
    
    const [problem, setProblem] = useState("");
    const [observeResponse, setObserveResponse] = useState("");
    const [thinkResponse, setThinkResponse] = useState("");
    const [decideResponse, setDecideResponse] = useState("");
    const [learnResponse, setLearnResponse] = useState("");
    const [loading, setLoading] = useState({
        observe: false,
        think: false,
        decide: false,
        learn: false
    });

    // Define the prompts from prompts.md
    const prompts = {
        observe: "OBSERVE. You are an AI agent. Your goal is, current Goal. Your past actions, past Actions. Please analyze the current situation and provide information to help achieve the goal.",
        think: "THINK. Based on this observation. Please think through the best next step to achieve, current Goal. Consider your past actions, past Actions.",
        decide: "DECIDE. Based on this thought. Please suggest the best action to take to achieve: current Goal. Available actions are, agent actions. Respond with a JSON object in this format.",
        learn: "LEARN. From this action. And this result. Please identify any patterns or lessons that could be useful for achieving: current Goal."
    };

    // Function to call Ollama API
    const callOllama = async (prompt, model = 'qwen3-vl:235b-cloud') => {
        try {
            // In a real implementation, this would call the actual Ollama API
            // For now, we'll simulate the response
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            return `This is a simulated response for: ${prompt.substring(0, 50)}...`;
        } catch (error) {
            console.error("Error calling Ollama:", error);
            return "Error: Could not get response from Ollama";
        }
    };

    const handleObserve = async () => {
        if (!problem) return;
        setLoading(prev => ({ ...prev, observe: true }));
        const fullPrompt = `${prompts.observe} Current problem: ${problem}`;
        const response = await callOllama(fullPrompt);
        setObserveResponse(response);
        setLoading(prev => ({ ...prev, observe: false }));
    };

    const handleThink = async () => {
        if (!observeResponse) return;
        setLoading(prev => ({ ...prev, think: true }));
        const fullPrompt = `${prompts.think} Based on this observation: ${observeResponse}`;
        const response = await callOllama(fullPrompt);
        setThinkResponse(response);
        setLoading(prev => ({ ...prev, think: false }));
    };

    const handleDecide = async () => {
        if (!thinkResponse) return;
        setLoading(prev => ({ ...prev, decide: true }));
        const fullPrompt = `${prompts.decide} Based on this thought: ${thinkResponse}`;
        const response = await callOllama(fullPrompt);
        setDecideResponse(response);
        setLoading(prev => ({ ...prev, decide: false }));
    };

    const handleLearn = async () => {
        if (!decideResponse) return;
        setLoading(prev => ({ ...prev, learn: true }));
        const fullPrompt = `${prompts.learn} From this action: ${decideResponse}`;
        const response = await callOllama(fullPrompt);
        setLearnResponse(response);
        setLoading(prev => ({ ...prev, learn: false }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Cognitive Loop</h2>
            
            {/* Problem Input Field */}
            <Card title="Problem Input" style={{ marginBottom: '20px' }}>
                <TextArea
                    placeholder="Enter your problem here..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows={4}
                />
            </Card>

            {/* Four Buttons */}
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

            {/* Four Areas */}
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