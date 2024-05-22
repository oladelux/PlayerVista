import { ChangeEvent, FC } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import Switch from '@mui/material/Switch'

import { Event, TeamResult } from '../../api'
import { formatSingleEventDate, formatSingleEventTime } from '../../utils/date.ts'
import { useAppDispatch } from '../../store/types.ts'
import { assignReporterThunk, reporterSelector, retractReporterThunk } from '../../store/slices/ReporterSlice.ts'

import { Popup } from '../Popup/Popup.tsx'

import './AssignModal.scss'

type AssignModalProps = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  scheduledMatches: Event[]
  currentTeam: TeamResult | undefined
  activeReporter: string
}

const AssignMatch: FC<AssignModalProps> = ({
  onClose, scheduledMatches, currentTeam, activeReporter }) => {
  const dispatch = useAppDispatch()
  const { reporters } = useSelector(reporterSelector)

  const isReporter = reporters.find(reporter => reporter.id === activeReporter)

  function handleMatchAssign(eventId: string) {
    const data = { eventId }
    dispatch(assignReporterThunk({ data, reporterId: activeReporter }))
      .unwrap()
      .then(() => console.log('its sent'))
  }

  function handleMatchRemove(eventId: string) {
    const data = { eventId }
    dispatch(retractReporterThunk({ data, reporterId: activeReporter }))
      .unwrap()
      .then(() => console.log('its sent'))
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>, eventId: string) {
    const isChecked = event.target.checked

    if (isChecked) {
      console.log('inside')
      handleMatchAssign(eventId)
    } else {
      console.log('outside')
      handleMatchRemove(eventId)
    }
  }

  return (
    <Popup onClose={onClose} className='Assign-match'>
      <div className='Assign-match__wrapper'>
        <div className='Assign-match__wrapper-title'>Scheduled Matches</div>
        <div className='Assign-match__wrapper-list'>
          {
            isReporter && scheduledMatches.map(match => (
              <div key={match.id} className='Assign-match__wrapper-list-item'>
                <div className='Assign-match__wrapper-list-item__date'>{formatSingleEventDate(match.startDate)}</div>
                <div className='Assign-match__wrapper-list-item__time'>{formatSingleEventTime(match.startDate)}</div>
                <div className='Assign-match__wrapper-list-item__detail'>
                  {match.location === 'Home'
                    ? `${currentTeam?.teamName} vs ${match.opponent}` : `${match.opponent} vs ${currentTeam?.teamName}`}
                </div>
                <div className='Assign-match__wrapper-list-item__actions'>
                  <Switch
                    checked={isReporter.eventId === match.id}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) => handleChange(event, match.id)}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Popup>
  )
}

export const AssignModal: FC<AssignModalProps> = ({
  onClose, scheduledMatches, currentTeam, activeReporter }) => {
  const container = document.body

  return ReactDOM.createPortal(
    <AssignMatch onClose={onClose} scheduledMatches={scheduledMatches}
      currentTeam={currentTeam} activeReporter={activeReporter} />, container)
}
