import { Link } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PersonIcon from '@mui/icons-material/Person'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined'

import { routes } from '@/constants/routes.ts'

import PlayerVistaLogo from '../../assets/images/icons/playervista.png'


import './Home.scss'

const HomeHeader = () => {
  return (
    <div className='Home__header'>
      <div className='Home__header-logo'>
        <img className='Home__header-logo-img' src={PlayerVistaLogo} alt='playervista' width={100}/>
      </div>
      <div className='Home__header-nav'>
        <Link to={routes.login} className='Home__header-nav--link'>Sign in</Link>
        <Link to={routes.demoBooking} className='Home__header-nav--get-started'>Book a Demo</Link>
      </div>
    </div>
  )
}

const HomeFooter = () => {
  return (
    <div className='Home__footer'>
      <div className='Home__footer-title'>PlayerVista</div>
      <ul className='Home__footer-list'>
        <li className='Home__footer-list-item'>
          &copy; PlayerVista 2024
        </li>
        <li className='Home__footer-list-item'>
          <Link to='#'>Privacy Policy</Link>
        </li>
        <li className='Home__footer-list-item'>
          <Link to='#'>Cookies</Link>
        </li>
        <li className='Home__footer-list-item'>
          <Link to='#'>Terms of use</Link>
        </li>
      </ul>
    </div>
  )
}

export const Home = () => {
  return (
    <div className='Home'>
      <HomeHeader />
      <div className='Home__hero'>
        <div className='Home__hero-title'>
          Manage Your Player, Master the Game
        </div>
        <div className='Home__hero-text'>
          Effortlessly <span className='border-b-2 border-dark-purple font-bold'>manage</span> your players, <span className='border-b-2 border-dark-purple font-bold'>track</span> real-time stats,
          and <span className='border-b-2 border-dark-purple font-bold'>unlock</span> insights to <span className='border-b-2 border-dark-purple font-bold'>elevate</span> your game — all in one platform.
        </div>
        <Link to={routes.demoBooking} className='Home__hero-link'>Schedule demo</Link>
      </div>
      <div className='Home__features'>
        <div className='Home__features-title'>What we provide</div>
        <div className='Home__features-text'>The amazing features we offer our users</div>
        <div className='Home__features-list'>
          <div className='Home__features-list--item'>
            <DashboardOutlinedIcon className='Home__features-list--item-icon' />
            <div className='Home__features-list--item-title'>Real-time Tracking</div>
            <div className='Home__features-list--item-text'>Access live player stats during matches.
            </div>
          </div>
          <div className='Home__features-list--item'>
            <PersonIcon className='Home__features-list--item-icon' />
            <div className='Home__features-list--item-title'>Detailed Analytics</div>
            <div className='Home__features-list--item-text'>Get comprehensive performance metrics.
            </div>
          </div>
          <div className='Home__features-list--item'>
            <EventAvailableIcon className='Home__features-list--item-icon' />
            <div className='Home__features-list--item-title'>Customizable Reports</div>
            <div className='Home__features-list--item-text'>Generate tailored reports for teams and individuals.</div>
          </div>
          <div className='Home__features-list--item'>
            <ConnectWithoutContactOutlinedIcon className='Home__features-list--item-icon' />
            <div className='Home__features-list--item-title'>Affordable Solutions</div>
            <div className='Home__features-list--item-text'>Designed for amateur clubs and individual players.</div>
          </div>
        </div>
      </div>
      <div className='Home__subscribe'>
        <div className='Home__subscribe-overlay'>
          <div className='Home__subscribe-overlay-title'>Join our growing community</div>
          <div className='Home__subscribe-overlay-text'>Stay connected with fellow users and administrators by subscribing to our newsletter.
            Get the latest updates and be part of our growing community</div>
          <form className='Home__subscribe-overlay-form'>
            <input
              type='text'
              className='Home__subscribe-overlay-form-input'
              placeholder='Enter your email address here'
            />
            <button type='submit' className='Home__subscribe-overlay-form-btn'>Subscribe</button>
          </form>
        </div>
      </div>
      <HomeFooter />
    </div>
  )
}
