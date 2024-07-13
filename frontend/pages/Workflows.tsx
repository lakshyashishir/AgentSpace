import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {  getWorkflows, createWorkflow, } from '@/services/api'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Header } from '@/components/Header'

export default function Workflows() {
    const { toast } = useToast()
    const [newWorkflowName, setNewWorkflowName] = useState('')
    const [newWorkflowDescription, setNewWorkflowDescription] = useState('')
  
    const { data: workflows, isLoading: isWorkflowsLoading } = useQuery({
      queryKey: ['workflows'],
      queryFn: getWorkflows,
    })
  
    const createWorkflowMutation = useMutation({
      mutationFn: createWorkflow,
      onSuccess: () => {
        toast({ title: "Workflow created successfully" })
        setNewWorkflowName('')
        setNewWorkflowDescription('')
      },
      onError: () => {
        toast({ title: "Failed to create workflow", variant: "destructive" })
      },
    })
  
    const handleCreateWorkflow = () => {
      createWorkflowMutation.mutate({ name: newWorkflowName, description: newWorkflowDescription })
    }
  
    if (isWorkflowsLoading) return (
      <>
        <Header />
        <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Workflows</h1>
            <div className="flex flex-col flex-1 items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 mt-12 border-t-2 border-b-2 border-black"></div>
        </div>
          </div>
        </div>
      </>
    )
  
    return (
      <>
      <Header />
      <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
        {/* <h1 className="text-3xl font-bold">Workflows</h1> */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Workflow Name" 
              value={newWorkflowName} 
              onChange={(e) => setNewWorkflowName(e.target.value)} 
            />
            <Textarea 
              placeholder="Workflow Description" 
              value={newWorkflowDescription} 
              onChange={(e) => setNewWorkflowDescription(e.target.value)} 
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
          </CardFooter>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows?.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{workflow.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </>
    )
  }
  