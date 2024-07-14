import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getProfile, updateProfile } from '@/services/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    bio: '',
    twitter: '',
    instagram: '',
    website: '',
    profilePicture: null as File | null,
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.address],
    queryFn: () => getProfile(user?.address),
    enabled: !!user?.address,
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      updateUser(updatedProfile)
      toast({ title: "Profile updated successfully" })
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" })
    },
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        twitter: profile.twitter || '',
        instagram: profile.instagram || '',
        website: profile.website || '',
        profilePicture: null,
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePicture: e.target.files![0] }))
    }
  }

  const handleUpdateProfile = () => {
    if (user?.address) {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })
      formDataToSend.append('address', user.address)
      updateProfileMutation.mutate(formDataToSend)
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p>Please connect your wallet to view your profile.</p>
          </div>
        </div>
      </>
    )
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
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                name="username"
                placeholder="Username" 
                value={formData.username} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="Email" 
              value={formData.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio"
              name="bio"
              placeholder="Tell us about yourself" 
              value={formData.bio} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter"
                name="twitter"
                placeholder="Twitter username" 
                value={formData.twitter} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input 
                id="instagram"
                name="instagram"
                placeholder="Instagram username" 
                value={formData.instagram} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website"
                name="website"
                placeholder="Your website" 
                value={formData.website} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Input 
              id="profilePicture"
              name="profilePicture"
              type="file" 
              onChange={handleFileChange} 
              accept="image/*"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}