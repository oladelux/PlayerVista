import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { EventFormData } from '@/api'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useUpdates } from '@/hooks/useUpdates'
import { cn } from '@/lib/utils'
import { eventService } from '@/singletons'
import { useAuth } from '@/useAuth'
import { SessionInstance } from '@/utils/SessionInstance'

const formSchema = z.object({
  matchType: z.enum(['home', 'away']),
  opponent: z.string().min(1, 'Opponent name is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  info: z.string().optional(),
})

type CreateMatchFormProps = {
  onSuccess: () => void
}

export function CreateMatchForm({ onSuccess }: CreateMatchFormProps) {
  const { toast } = useToast()
  const teamId = SessionInstance.getTeamId()
  const logger = useUpdates()
  const { localSession } = useAuth()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchType: 'home',
      opponent: '',
      time: '',
      location: '',
      info: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!teamId || !localSession) return
    const data: EventFormData = {
      type: 'match',
      date: new Date(values.date),
      time: values.time,
      matchType: values.matchType,
      location: values.location,
      opponent: values.opponent,
      info: values.info,
      teamId,
      userId: localSession.userId,
    }
    await eventService.insert(data, teamId).then(() => {
      toast({
        title: 'Match created successfully',
        description: `Match against ${values.opponent} on ${format(values.date, 'PPP')}`,
        variant: 'success',
      })
      logger.setUpdate({
        message: 'added a new player',
        userId: localSession.userId,
        groupId: localSession.groupId,
      })
      logger.sendUpdates(localSession.groupId)
      navigate('/events', { replace: true })
    })
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='matchType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select match type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='home'>Home</SelectItem>
                  <SelectItem value='away'>Away</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='opponent'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opponent Name</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input {...field} placeholder='Enter opponent name' className='pl-9' />
                  <Users className='absolute left-3 top-3 size-4 text-muted-foreground' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto size-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input {...field} placeholder='e.g., 19:45' type='time' className='pl-9' />
                  </FormControl>
                  <Clock className='absolute left-3 top-3 size-4 text-muted-foreground' />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location/Address</FormLabel>
              <div className='relative'>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter the match location or address'
                    className='pl-9'
                  />
                </FormControl>
                <MapPin className='absolute left-3 top-3 size-4 text-muted-foreground' />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='info'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <div className='relative'>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Enter any additional information about the match'
                    className='min-h-[100px]'
                  />
                </FormControl>
              </div>
              <FormDescription>
                Add any notes, special instructions, or details about the match.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2 pt-2'>
          <Button type='button' variant='outline' onClick={onSuccess}>
            Cancel
          </Button>
          <Button type='submit'>Create Match</Button>
        </div>
      </form>
    </Form>
  )
}
