import { encoding_for_model, Tiktoken } from "tiktoken";
import OpenAI from "openai";

class EmbeddingService{
    private openai: OpenAI | null;
    private isConfigured: boolean;
    private tokenEncoder: Tiktoken | null;

    constructor(){
        this.openai = null;
        this.isConfigured = false;
        this.tokenEncoder = null;
    }

    initialize(){
        if (process.env.OPENAI_API_KEY && !this.openai){
            this.openai = new OpenAI({
                apiKey: process.env.OPEN_API_KEY,
            });

        this.isConfigured = true;
        console.log('OpenAI embedding service initialized');
        } else if(!process.env.OPENAI_API_KEY){
            console.warn('OPENAI_API_KEY not set - embedding features will be disabled');
            this.isConfigured = false;
        }
    }

    isReady(){
        return Boolean(this.isConfigured && this.openai);
    }

    splitTextIntoChuncks(text: string, maxChunkSize = 1000){

        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        let currentChunk = '';

        for(const sentence of sentences){
            const trimmedSentence = sentence.trim();
            if (currentChunk.length + trimmedSentence.length > maxChunkSize){
                if(currentChunk){
                    chunks.push(currentChunk.trim());
                    currentChunk = trimmedSentence;
                }else{
                    const words = trimmedSentence.split(' ');
                    let wordChunk = '';

                    for (const word of words) {

                        if (wordChunk.length + word.length > maxChunkSize) {
                            if (wordChunk) {
                                chunks.push(wordChunk.trim());
                                wordChunk = word;
                            } else {
                                chunks.push(word); // Single word too long, just add it
                            }

                        } else {
                            wordChunk += (wordChunk ? ' ' : '') + word;
                        }
                    }
                    if(wordChunk){
                        currentChunk = wordChunk;
                    }
                } 
            }else{
                currentChunk += (currentChunk ? '.': '') + trimmedSentence;
            }
        }
        if(currentChunk){
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }


    async generateEmbedding(text: string){
        if(!this.isReady()){
            console.warn('Embedding service not configured, skipping embedding generation');
            return null;
        }

        try {
            console.log(`Generating embedding for text(${text.length} chars)...`)

            const response = await this.openai?.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
                encoding_format: 'float',
            });

            console.log('Embedding generated successfully');
            return response?.data[0]?.embedding;
        
        } catch (error) {
            const message = error instanceof Error? error.message: String(error);
            console.error('Embedding generation failed: ', message);
            throw new Error(`Embedding generation failed: ${message}`);      
        }
    }

    async generateEmbeddingsForChunks(chunks: string[]){
        
        if (!this.isReady()) {
            return chunks.map(() => null);
        }

        const validChunks = chunks.filter(chunk => {
        const trimmed = chunk.trim();
        return trimmed.length > 0 && trimmed.length < 8000; // Safe limit
        });

        if (validChunks.length === 0) {
            console.warn('No valid chunks to process');
            return chunks.map(() => null);
        }

        try{
            console.log(`Generating embeddings for ${chunks.length} chunks...`);

            const response = await this.openai?.embeddings.create({
                model: 'text-embedding-3-small',
                input: chunks,
                encoding_format: 'float',
            });

            console.log(`Generated ${response?.data.length} embeddings`);
            return response?.data.map(item => item.embedding);

        }catch(error){
            const message = error instanceof Error? error.message: String(error);
            console.error('Batch embedding generation failed: ', message);
            throw new Error(`Batch embedding generation failed: ${message}`);
        }
    }

    cosineSimilarity(embedding1: number[], embedding2: number[]){

        if(!embedding1 || !embedding2 || embedding1.length !== embedding2.length){
            return 0;
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i =0; i<embedding1.length; i++){
            dotProduct +=embedding1[i]! * embedding2[i]!;
            norm1 += embedding1[i]! * embedding1[i]!;
            norm2 += embedding2[i]! * embedding2[i]!;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
    }

    estimateTokenCount(text: string): number {
        if (this.tokenEncoder) {
            try {
                // Accurate token count using tiktoken
                const tokens = this.tokenEncoder.encode(text);
                return tokens.length;
            } catch (error) {
                console.warn('Token encoding failed, using approximation');
            }
        }
        
        // Fallback: rough approximation
        return Math.ceil(text.length / 4);
    }

}
 const embeddingService = new EmbeddingService();
 embeddingService.initialize();

 export default embeddingService;