import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Save, Loader2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// State management
import {
  selectUser,
  selectProfile,
  updateUserProfile,
  selectUserStatus
} from '@/store/slices/userSlice';
import { uploadFile, getPublicUrl } from '@/lib/supabase';
import { AppDispatch } from '@/store';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Selectors
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const status = useSelector(selectUserStatus);

  // Local state
  const [username, setUsername] = useState(profile?.username || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial values from profile when it loads
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  // Handle avatar click to open file selector
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Set file and preview
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar upload to Supabase
  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;

    try {
      setIsUploading(true);

      // Upload to Supabase storage
      const fileName = `${user.id}_${Date.now()}_${avatarFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `avatars/${fileName}`;

      const storageData = await uploadFile('avatars', filePath, avatarFile);

      if (!storageData) {
        throw new Error('Failed to upload avatar');
      }

      // Get public URL
      const publicUrl = getPublicUrl('avatars', filePath);

      return publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setUsernameError('');
    setFullNameError('');

    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.includes(' ')) {
      setUsernameError('Username cannot contain spaces');
      isValid = false;
    }

    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Name is required');
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user || !profile) {
      return;
    }

    try {
      // Upload avatar if changed
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Update profile
      const updates = {
        username,
        full_name: fullName,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      };

      await dispatch(updateUserProfile({ userId: user.id, updates }));

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get initial letters for avatar fallback
  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return 'U';
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Update your profile information and avatar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Make changes to your profile information here.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium mb-4">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div
                  className="cursor-pointer relative group"
                  onClick={handleAvatarClick}
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || ''} alt={fullName} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading || status === 'loading'}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">Upload new avatar</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click on the avatar to change it. JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Email - non-editable */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your email cannot be changed
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isUploading || status === 'loading'}
              />
              {fullNameError && (
                <p className="mt-1 text-xs text-destructive">{fullNameError}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isUploading || status === 'loading'}
              />
              {usernameError && (
                <p className="mt-1 text-xs text-destructive">{usernameError}</p>
              )}
            </div>

            {/* Current Plan */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Plan
              </label>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium capitalize">{profile.current_plan}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.tokens_left} tokens remaining
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/pricing'}>
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isUploading || status === 'loading'}
            >
              {isUploading || status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
