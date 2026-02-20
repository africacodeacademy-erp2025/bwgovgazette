import OpenAI from 'openai';

interface OpenAIEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

class EmbeddingService{
    private openai: OpenAI | null = null;
    private configured = false;

    constructor (){
        if(process.env.OPENAI_API_KEY){
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            this.configured = true;
            console.log('Embedding service ready');
        }
    }

    isReady(){
        return this.configured && !!this.openai;
    }

    splitTextIntoChunks(text: string, maxSize = 1000){

        const sentences = text.split(/[.!?]+/);
        const chunks: string[] = [];
        let current = '';

        for (const sentence of sentences){
            
            if(current.length + sentence.length > maxSize){
                
                chunks.push(current.trim());
                current = sentence;
            } else{
                current += (current ? '.': '') + sentence; 
            }
        }

        if (current) chunks.push(current.trim());
        return chunks;
    }

    async generateEmbeddingzForChunks(chunks: string[]){
        if (!this.isReady()) return chunks.map(()=> null);

        const response = await this.openai!.embeddings.create({
            model: 'text-embedding-3-small',
            input: chunks
        });

        return response.data.map(document => document.embedding)
    }

    async generateEmbedding(text: string): Promise<number[] | null> {
        if (!this.isReady()) return null;

        const response = await this.openai!.embeddings.create({
            model: 'text-embedding-3-small',
            input: [text]
        });

        return response.data[0]?.embedding ?? null;
    }
}

declare global {
  var embeddingService: EmbeddingService | undefined;
}

export const embeddingService = globalThis.embeddingService ?? (globalThis.embeddingService = new EmbeddingService());