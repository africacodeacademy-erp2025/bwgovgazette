# Keyword Search API Setup Guide

## ✅ What's Been Implemented

1. **Edge Function**: `/supabase/functions/search/index.ts` - Full-text search API endpoint
2. **React Hook**: `useSearch` - Manages search state and API calls
3. **Search Component**: `SearchResults` - Displays search results with snippet highlighting
4. **Integration**: Added to main page with search input and results display

## 🔧 Setup Required

### 1. Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Create gazettes table
CREATE TABLE IF NOT EXISTS gazettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  publication_date DATE NOT NULL,
  category TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS gazettes_search_idx 
ON gazettes 
USING gin(to_tsvector('english', title || ' ' || content));

-- Create search function with snippet highlighting
CREATE OR REPLACE FUNCTION search_gazettes(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  publication_date DATE,
  snippet TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.title,
    g.publication_date,
    ts_headline(
      'english',
      g.title || ' ' || g.content,
      plainto_tsquery('english', search_query),
      'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
    ) as snippet,
    ts_rank(
      to_tsvector('english', g.title || ' ' || g.content),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM gazettes g
  WHERE to_tsvector('english', g.title || ' ' || g.content) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, g.publication_date DESC
  LIMIT 50;
END;
$$;

-- Insert sample data for testing
INSERT INTO gazettes (title, content, publication_date, category) VALUES
('Tax Amendment Notice 2024', 'This notice announces changes to the tax regulations effective January 1, 2024. All taxpayers must comply with the new requirements. The new tax rates will apply to both individual and corporate entities. Property tax assessments will be updated according to the new guidelines.', '2024-01-15', 'Finance'),
('Business License Requirements', 'New business license requirements for small enterprises. All businesses must register by March 31, 2024. The registration process includes submitting financial statements, proof of address, and compliance certificates.', '2024-02-10', 'Commerce'),
('Property Tax Updates', 'Updated property tax rates and assessment procedures. Property owners should review their tax obligations. The new rates take effect immediately and apply to all residential and commercial properties.', '2024-03-05', 'Finance'),
('Environmental Regulations', 'New environmental protection measures for industrial activities. Companies must implement compliance measures by June 2024. All manufacturing facilities must conduct environmental impact assessments.', '2024-01-20', 'Environment');
```

### 2. Deploy Edge Function
```bash
supabase functions deploy search
```

### 3. Test the API
Once deployed, you can test the search:
- Try searching for "tax" - should return tax-related notices with highlighted snippets
- Try "business" - should return business license information
- Try "property" - should return property tax updates

## 🎯 Features Implemented

✅ **Full-text search**: Uses PostgreSQL's `@@` operator for advanced text searching
✅ **Snippet highlighting**: Uses `ts_headline` to highlight matching terms with `<mark>` tags  
✅ **JSON Response**: Returns `{ id, title, publication_date, snippet }` format as requested
✅ **Ranking**: Results sorted by relevance and publication date
✅ **CORS Support**: Handles cross-origin requests properly
✅ **Error Handling**: Proper error responses and validation
✅ **UI Integration**: Search results display in the main page with loading states

## 🔍 How It Works

1. User types search query (e.g., "tax")
2. `useSearch` hook calls the `/api/search` endpoint 
3. Edge Function queries database using full-text search
4. PostgreSQL returns results with highlighted snippets
5. Results display with matching terms highlighted in the UI

The search supports:
- Multi-word queries
- Partial word matching  
- Relevance ranking
- Real-time snippet highlighting
- Fast full-text indexing