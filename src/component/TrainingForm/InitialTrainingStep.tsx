import {FC} from "react"
import {Stack} from '@chakra-ui/react'
import {Input} from '@chakra-ui/react'

import {Field} from "formik"

export const InitialTrainingStep: FC = () => {

  return (
    <>
        <Field
          name="teamName"
          as={Input}
          placeholder="Team Name"
          className='outline-0'
        />
      <Stack direction='row' spacing={4} mt={10} justify="center">
        <Field
          name="timestamp"
          as={Input}
          placeholder="Example: 01-8-2023"
          className='outline-0'
        />
        <Field
          name="name"
          as={Input}
          className='outline-0'
        />
      </Stack>
    </>
  )
}
