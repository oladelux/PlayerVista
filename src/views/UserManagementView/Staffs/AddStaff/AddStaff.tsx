import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import generator from 'generate-password-ts'
import { Briefcase, CheckCircle, Lock, Mail, User, UserCircle, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

// Form schema
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
})

// Mock roles data
const rolesData = [
  { id: '1', name: 'coach' },
  { id: '2', name: 'assistant coach' },
  { id: '3', name: 'physiotherapist' },
  { id: '4', name: 'nutritionist' },
  { id: '5', name: 'analyst' },
  { id: '6', name: 'manager' },
]

type FormValues = z.infer<typeof formSchema>

export function AddStaff() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const password = generator.generate({
    length: 10,
    numbers: true,
    lowercase: true,
    uppercase: true,
    strict: true,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      // Mock API call - in real app, this would dispatch to your Redux action
      console.log('Form values:', values)
      console.log('With additional data:', {
        ...values,
        password,
        // teamId: SessionInstance.getTeamId(),
        // groupId: user.groupId,
        // parentUserId: user.id,
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      setShowSuccess(true)
      form.reset()

      // Log the update (mock implementation)
      // logger.setUpdate({
      //   message: 'added a new staff',
      //   userId: user.id,
      //   groupId: user.groupId,
      // });
      // logger.sendUpdates(user.groupId);

      toast({
        title: 'Staff added successfully',
        description: `${values.firstName} ${values.lastName} has been added as ${values.role}`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error creating staff:', error)
      toast({
        title: 'Failed to add staff',
        description: 'There was an error adding the staff member. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    navigate('/staffs')
  }

  return (
    <div className='container mx-auto max-w-5xl px-4 py-6'>
      <div className='mt-8 grid grid-cols-1 gap-8'>
        {showSuccess ? (
          <Card className='border-green-100 shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2 text-2xl text-green-600'>
                <CheckCircle className='size-6' />
                Staff Added Successfully
              </CardTitle>
              <CardDescription>The staff member has been added to your team</CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              <p className='mb-4 text-sm text-muted-foreground'>
                An email with login instructions will be sent to the staff member.
              </p>
              <Button onClick={handleCloseSuccess}>Return to Staff List</Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-8'>
            <Card className='shadow-md'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <UserPlus className='size-6 text-primary' />
                  Staff Information
                </CardTitle>
                <CardDescription>Enter the details of the new staff member</CardDescription>
              </CardHeader>

              <Separator />

              <CardContent className='pt-6'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='size-4 text-muted-foreground' />
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder='Enter first name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <UserCircle className='size-4 text-muted-foreground' />
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder='Enter last name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Mail className='size-4 text-muted-foreground' />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input type='email' placeholder='staff@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Briefcase className='size-4 text-muted-foreground' />
                              Role
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select staff role' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rolesData
                                  .slice()
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(role => (
                                    <SelectItem key={role.id} value={role.name}>
                                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Alert className='bg-muted/50'>
                      <Lock className='size-4' />
                      <AlertTitle>Temporary Password</AlertTitle>
                      <AlertDescription>
                        A temporary password will be generated and sent to the staff member. They
                        will be prompted to change it on first login.
                      </AlertDescription>
                    </Alert>

                    <CardFooter className='flex justify-end gap-2 px-0 pt-4'>
                      <Button type='button' variant='outline' onClick={() => navigate('/staffs')}>
                        Cancel
                      </Button>
                      <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Adding Staff...' : 'Add Staff'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
