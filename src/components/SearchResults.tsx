import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner-1'

interface SearchResult {
  id: string
  title: string
  publication_date: string
  snippet: string
}

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  error: string | null
  query: string
}

export function SearchResults({ results, loading, error, query }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size={32} />
        <span className="ml-3 text-muted-foreground">Loading results...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <FileText className="h-4 w-4" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results.length && query) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No results found</h3>
          <p className="text-muted-foreground">
            No gazettes found for "{query}". Try different keywords.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!query) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>
      
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-lg leading-tight">
                {result.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(result.publication_date).toLocaleDateString()}
                  </span>
                </div>
                <Badge variant="secondary">Official Notice</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: result.snippet.replace(
                  /<mark>/g, 
                  '<mark class="bg-primary/20 text-primary font-medium px-1 rounded">'
                )
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}