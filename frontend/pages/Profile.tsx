import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getProfile, updateProfile, getWorkflows, createWorkflow, getMarketplaceItems, purchaseItem } from '@/services/api'
import { useWeb3 } from '@/contexts/Web3Context'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Header } from '@/components/Header'

export default function Profile() {
  const { account } = useWeb3()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', account?.address],
    queryFn: () => getProfile(account?.address),
    enabled: !!account?.address,
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({ title: "Profile updated successfully" })
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" })
    },
  })

  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setBio(profile.bio)
    }
  }, [profile])

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({ address: account?.address, username, bio })
  }

  if (isProfileLoading) return (
    <>
      <Header />
      <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex flex-col flex-1 items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 mt-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <>
    <Header />
    <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
      {/* <h1 className="text-3xl font-bold">Profile</h1> */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <Textarea 
            placeholder="Bio" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

