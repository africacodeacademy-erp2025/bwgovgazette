import OpenAI from "openai";

interface SummaryOptions {
  maxWords?: number;
  style?: 'concise' | 'executive' | 'bullet-points';
  includeKeyPoints?: boolean;
}

class SummaryService{
    private openai: OpenAI | null;
    private isEnabled: boolean;
    constructor(){
        this.openai =null;
        this.isEnabled =false;

        if(process.env.OPENAI_API_KEY){
            try{
                this.openai =new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY
                });
            this.isEnabled = true;
            console.log('OpenAI summarization service initialized');

            }catch(error){
                console.log()
            }
        }else{
            console.warn('OPENAI_API_KEY not set - document summarization will be disabled');
        }
    }

    isReady(){
        return this.isEnabled && this.openai;
    }

    async generateSummary(text: string, options: SummaryOptions = {}){
        
        if(!this.isReady()){
            console.warn('Summarization service not available - skipping summary generation');
            return null;
        }

        if(!text || text.length< 100){
            console.log('Text too short for meaningful summarization');
            return null;
        }

        const{ maxWords =300, style ='concise', includeKeyPoints = true } = options;


        
        try{
            console.log(`Generating summary for ${text.length} character document`);

            const maxInputLength = 8000;
            const inputText = text.length > maxInputLength? text.substring(0,maxInputLength)+ '...': text;
            
            const systemPrompt = this.buildSystemPrompt({maxWords, style, includeKeyPoints});
            const userPrompt = `Please summarize the following document:\n\n${inputText}`;

            const completion = await this.openai!.chat.completions.create({
                model: "chatgpt-4o-latest",
                messages:[
                    {role: "system", content: systemPrompt},
                    {role: "user", content: userPrompt}
                ],
                max_tokens: Math.min(maxWords * 2, 1000),
                temperature: 0.3
            });

            const summary = completion.choices[0]?.message?.content?.trim();

            if(!summary){
                throw new Error('No Summary content  recieved from OpenAI');
            }

            console.log(`Generated ${summary.length} character summary (${summary.split(' ').length} words)`);

            return{
                summary,
                wordCount: summary.split(' ').length,
                origialLength: text.length,
                truncated: text.length >maxInputLength,
                tokensUsed: completion.usage?.total_tokens || 0,
                model: completion.model
            };

        }catch(error){
            const message = error instanceof Error? error.message: String(error)
            console.error('Summary generation failed', message);
            return null; //continue document upload without an error
        }
    }

    buildSystemPrompt(options: SummaryOptions ){
        let prompt: string = `You are an expert document summarizer. Create a clear, informative summary that captures the essential information and main points of the document.

Requirements:
- Maximum ${options.maxWords} words
- Be concise but comprehensive
- Focus on key facts, decisions, and actionable information
- Use clear, professional language`;

        if (options.style === 'bullet-points') {
      prompt += '\n- Format as bullet points for easy scanning';
    } else if (options.style === 'executive') {
      prompt += '\n- Write in executive summary style for business professionals';
    } else {
      prompt += '\n- Write in paragraph format with smooth flow between ideas';
    }

    if (options.includeKeyPoints) {
      prompt += '\n- Highlight the most important takeaways';
    }

    prompt += '\n\nDocument types to consider: contracts, invoices, memos, reports, letters, forms, and other business documents.';

    return prompt;
    }

    async testConnection(){

        if(!this.isReady){
            return {status: 'disabled', reason: 'API key not available'};
        }

        try{
            const testResponse = await this.openai?.chat.completions.create({
                model: "gpt-5",
                messages: [{ role: "user", content: "Say 'test successful'" }],
                max_completion_tokens: 10
            });
        
             return { 
                status: 'ready', 
                model: testResponse!.model,
                response: testResponse!.choices[0]?.message?.content 
      };
        }catch(error){
            const message = error instanceof Error? error.message: String(error)
            return{
                status: 'error',
                error: message
            };
        }
    }

}

export default new SummaryService();