import {
  Box,
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import axios from 'axios'
import posthog from 'posthog-js'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import InfoIconBig from '@/assets/icons/infoIconBig'
import {
  selectCcpDropdowns,
  setCcpModalDropdown,
} from '@/store/slices/dropdownsSlice'
import { selectConnectedSocialsClicked,setConnectedSocialsClicked } from '@/store/slices/readDataSlice'
import RegisteredInstagramLogo from '@/assets/icons/registeredInstagramLogo'
import RegisteredFacebookLogo from '@/assets/icons/registeredFacebookLogo'
import RegisteredLinkedinLogo from '@/assets/icons/registeredLinkedinLogo'
import RegisteredYoutubeLogo from '@/assets/icons/registeredYoutubeLogo'
import RegisteredTikTokIcon from '@/assets/icons/registeredTikTokIcon'
import RegisteredMediumIcon from '@/assets/icons/registeredMediumIcon'
import RegisteredTwitterIcon from '@/assets/icons/registeredTwitterIcon'

const ApplicationList = [
  {
    id: 1,
    name: 'Twitter (X)',
  },
  {
    id: 2,
    name: 'Youtube',
  },
  {
    id: 3,
    name: 'Medium',
  },
  {
    id: 4,
    name: 'Reddit',
  },
  {
    id: 5,
    name: 'TikTok',
  },
  {
    id: 6,
    name: 'Instagram',
  },
  {
    id: 7,
    name: 'LinkedIn',
  },
]

interface RegisterCCPModalProps {
  userSocialsData: any
}

const RegisterCCPModal: React.FC<RegisterCCPModalProps> = ({
  userSocialsData,
}) => {
  const [socialHandle, setSocialHandle] = useState([
    {
      handle1: {
        name: '',
        handle: '',
      },
    },
    {
      handle2: {
        name: '',
        handle: '',
      },
    },
    {
      handle3: {
        name: '',
        handle: '',
      },
    },
    {
      handle4: {
        name: '',
        handle: '',
      },
    },
    {
      handle5: {
        name: '',
        handle: '',
      },
    },
    {
      handle6: {
        name: '',
        handle: '',
      },
    },
    {
      handle7: {
        name: '',
        handle: '',
      },
    },
    {
      handle8: {
        name: '',
        handle: '',
      },
    },
  ])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address } = useAccount()

  const ccpDropdowns = useSelector(selectCcpDropdowns)
  const registeredClick = useSelector(selectConnectedSocialsClicked)
  const dispatch = useDispatch()

  function extractTwitterUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const twitterIndex = social.indexOf('twitter.com/')

        if (twitterIndex !== -1) {
          const username = social.substring(
            twitterIndex + 'twitter.com/'.length
          )
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractYoutubeUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const youtubeIndex = social.indexOf('youtube.com/')

        if (youtubeIndex !== -1) {
          const username = social.substring(
            youtubeIndex + 'youtube.com/'.length
          )
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractMediumUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const mediumIndex = social.indexOf('medium.com/')

        if (mediumIndex !== -1) {
          const username = social.substring(mediumIndex + 'medium.com/'.length)
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractRedditUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const redditIndex = social.indexOf('reddit.com/')

        if (redditIndex !== -1) {
          const username = social.substring(redditIndex + 'reddit.com/'.length)
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractTikTokUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const tiktokIndex = social.indexOf('tiktok.com/')

        if (tiktokIndex !== -1) {
          const username = social.substring(tiktokIndex + 'tiktok.com/'.length)
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractInstagramUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const instagramIndex = social.indexOf('instagram.com/')

        if (instagramIndex !== -1) {
          const username = social.substring(
            instagramIndex + 'instagram.com/'.length
          )
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  function extractLinkedInUsernames(data: any[]) {
    const usernames: any = []

    data.forEach((item: any) => {
      const socials = item.socials.split(', ')

      socials.forEach((social: any) => {
        const linkedInIndex = social.indexOf('linkedin.com/')

        if (linkedInIndex !== -1) {
          const username = social.substring(
            linkedInIndex + 'linkedin.com/in/'.length
          )
          usernames.push(username)
        }
      })
    })

    return usernames
  }

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setCcpModalDropdown(dropdownName))
  }

  const handleRegisterSubmit = async () => {
    posthog.capture('Connect Socials Submit Button Clicked', {
      Clicked: true,
    })

    const finalLinkArray: any = []
    for (let i = 0; i < socialHandle.length; i++) {
      if (
        socialHandle[i]?.handle1?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'Youtube' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'Youtube' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'Medium' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'Medium' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'Reddit' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'Reddit' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'TikTok' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'TikTok' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'Instagram' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'Instagram' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle1?.name === 'LinkedIn' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle1?.handle}`
        )
      } else if (
        socialHandle[i]?.handle1?.name === 'LinkedIn' &&
        socialHandle[i]?.handle1?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle1?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'Youtube' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'Youtube' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'Medium' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'Medium' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'Reddit' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'Reddit' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'TikTok' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'TikTok' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'Instagram' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'Instagram' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle2?.name === 'LinkedIn' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle2?.handle}`
        )
      } else if (
        socialHandle[i]?.handle2?.name === 'LinkedIn' &&
        socialHandle[i]?.handle2?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle2?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'Youtube' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'Youtube' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'Medium' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'Medium' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'Reddit' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'Reddit' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'TikTok' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'TikTok' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'Instagram' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'Instagram' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle3?.name === 'LinkedIn' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle3?.handle}`
        )
      } else if (
        socialHandle[i]?.handle3?.name === 'LinkedIn' &&
        socialHandle[i]?.handle3?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle3?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'Youtube' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'Youtube' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'Medium' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'Medium' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'Reddit' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'Reddit' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'TikTok' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'TikTok' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'Instagram' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'Instagram' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle4?.name === 'LinkedIn' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle4?.handle}`
        )
      } else if (
        socialHandle[i]?.handle4?.name === 'LinkedIn' &&
        socialHandle[i]?.handle4?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle4?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'Youtube' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'Youtube' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'Medium' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'Medium' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'Reddit' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'Reddit' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'TikTok' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'TikTok' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'Instagram' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'Instagram' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle5?.name === 'LinkedIn' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle5?.handle}`
        )
      } else if (
        socialHandle[i]?.handle5?.name === 'LinkedIn' &&
        socialHandle[i]?.handle5?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle5?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'Youtube' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'Youtube' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'Medium' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'Medium' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'Reddit' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'Reddit' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'TikTok' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'TikTok' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'Instagram' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'Instagram' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle6?.name === 'LinkedIn' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle6?.handle}`
        )
      } else if (
        socialHandle[i]?.handle6?.name === 'LinkedIn' &&
        socialHandle[i]?.handle6?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle6?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://twitter.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'Twitter (X)' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractTwitterUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('Twitte handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'Youtube' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://youtube.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'Youtube' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractYoutubeUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('Youtube handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'Medium' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://medium.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'Medium' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractMediumUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('Medium handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'Reddit' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://reddit.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'Reddit' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractRedditUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('Reddit handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'TikTok' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://tiktok.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'TikTok' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractTikTokUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('TikTok handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'Instagram' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://instagram.com/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'Instagram' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractInstagramUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('Instagram handle already exists', {
          position: 'bottom-right',
        })
        return
      }

      if (
        socialHandle[i]?.handle7?.name === 'LinkedIn' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        !extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        finalLinkArray.push(
          `https://www.linkedin.com/in/${socialHandle[i]?.handle7?.handle}`
        )
      } else if (
        socialHandle[i]?.handle7?.name === 'LinkedIn' &&
        socialHandle[i]?.handle7?.handle !== '' &&
        extractLinkedInUsernames(userSocialsData).includes(
          socialHandle[i]?.handle7?.handle
        )
      ) {
        toast.error('LinkedIn handle already exists', {
          position: 'bottom-right',
        })
        return
      }
    }

    const socialProfiles = finalLinkArray.join(', ')

    try {
      setLoading(true)
      const res = await axios.post(
        'https://metricsapimainnet.hashstack.finance/api/ccp/registration',
        {
          address: address,
          socialProfiles: socialProfiles,
        }
      )
      if (res.status === 200) {
        dispatch(setConnectedSocialsClicked(!registeredClick))
        toast.success('Form submitted successfully', {
          position: 'bottom-right',
        })
      }
    } catch (error) {
      setLoading(false)
      toast.error('Error in submitting forms', {
        position: 'bottom-right',
      })
      console.error(error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const isDisabled = () => {
    for (let i = 0; i < count; i++) {
      if (
        socialHandle[i]?.handle1?.name === '' ||
        socialHandle[i]?.handle1?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle2?.name === '' ||
        socialHandle[i]?.handle2?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle3?.name === '' ||
        socialHandle[i]?.handle3?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle4?.name === '' ||
        socialHandle[i]?.handle4?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle5?.name === '' ||
        socialHandle[i]?.handle5?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle6?.name === '' ||
        socialHandle[i]?.handle6?.handle === ''
      )
        return true

      if (
        socialHandle[i]?.handle7?.name === '' ||
        socialHandle[i]?.handle7?.handle === ''
      )
        return true
    }
  }
  const resetStates = () => {
    setSocialHandle([
      {
        handle1: {
          name: '',
          handle: '',
        },
      },
      {
        handle2: {
          name: '',
          handle: '',
        },
      },
      {
        handle3: {
          name: '',
          handle: '',
        },
      },
      {
        handle4: {
          name: '',
          handle: '',
        },
      },
      {
        handle5: {
          name: '',
          handle: '',
        },
      },
      {
        handle6: {
          name: '',
          handle: '',
        },
      },
      {
        handle7: {
          name: '',
          handle: '',
        },
      },
      {
        handle8: {
          name: '',
          handle: '',
        },
      },
    ])
    setCount(1)
  }

  return (
    <div>
      <Button
        onClick={() => {
          posthog.capture('Connect Socials Modal Button Clicked', {
            Clicked: true,
          })
          onOpen()
        }}
        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        color="#f2f2f2"
        size="sm"
        width="100%"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        _hover={{ backgroundColor: 'transparent' }}
      >
        Connect Socials
      </Button>

      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            resetStates()
            onClose()
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5)" mt="3.8rem" />
          <ModalContent
            background="var(--Base_surface, #02010F)"
            color="white"
            borderRadius="md"
            maxW="954px"
            zIndex={1}
            mt="8rem"
            className="modal-content"
            px="1rem"
          >
            <ModalHeader
              mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
              display="flex"
              alignItems="center"
              gap="2"
            >
              Connect Socials
              <Tooltip
                hasArrow
                arrowShadowColor="#2B2F35"
                placement="right"
                boxShadow="dark-lg"
                label="Connect your social accounts."
                bg="#02010F"
                fontSize={'13px'}
                fontWeight={'400'}
                borderRadius={'lg'}
                padding={'2'}
                color="#F0F0F5"
                border="1px solid"
                borderColor="#23233D"
              >
                <Box>
                  <InfoIconBig />
                </Box>
              </Tooltip>
            </ModalHeader>

            <ModalCloseButton mt="1rem" mr="1rem" />

            {!loading ? (
              <ModalBody pb="2rem">
                <Card
                  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  p="1rem"
                  mt="-1.5"
                >
                  {/* Section 1  */}
                  {count >= 1 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown1')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[0]?.handle1?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown1 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown1 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[0] = {
                                          handle1: {
                                            name: name,
                                            handle:
                                              copy[0]?.handle1?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[0]?.handle1?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[0] = {
                                  handle1: {
                                    name: copy[0]?.handle1?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>

                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 2  */}
                  {count >= 2 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown2')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[1]?.handle2?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown2 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown2 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[1] = {
                                          handle2: {
                                            name: name,
                                            handle:
                                              copy[1]?.handle2?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[1]?.handle2?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[1] = {
                                  handle2: {
                                    name: copy[1]?.handle2?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>

                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 3  */}
                  {count >= 3 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown3')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[2]?.handle3?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown3 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown3 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[2] = {
                                          handle3: {
                                            name: name,
                                            handle:
                                              copy[2]?.handle3?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[2]?.handle3?.handle || ''}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[2] = {
                                  handle3: {
                                    name: copy[2]?.handle3?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>
                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 4  */}
                  {count >= 4 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown4')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[3]?.handle4?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown4 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown4 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[3] = {
                                          handle4: {
                                            name: name,
                                            handle:
                                              copy[3]?.handle4?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[3]?.handle4?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[3] = {
                                  handle4: {
                                    name: copy[3]?.handle4?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>
                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 5  */}
                  {count >= 5 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown5')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[4]?.handle5?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown5 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown5 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[4] = {
                                          handle5: {
                                            name: name,
                                            handle:
                                              copy[4]?.handle5?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[4]?.handle5?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[4] = {
                                  handle5: {
                                    name: copy[4]?.handle5?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>
                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 6  */}
                  {count >= 6 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown6')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[5]?.handle6?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown6 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown6 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[5] = {
                                          handle6: {
                                            name: name,
                                            handle:
                                              copy[5]?.handle6?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[5]?.handle6?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[5] = {
                                  handle6: {
                                    name: copy[5]?.handle6?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>
                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  {/* Section 7  */}
                  {count >= 7 && (
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Select the application you want to connect."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          fontSize="sm"
                          onClick={() => {
                            handleDropdownClick('registerCCPDropdown7')
                          }}
                        >
                          <Box display="flex" gap="1" userSelect="none">
                            <Text color="white">
                              {socialHandle[6]?.handle7?.name ||
                                'Select Application'}
                            </Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {ccpDropdowns.registerCCPDropdown7 ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {ccpDropdowns.registerCCPDropdown7 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height="120px"
                              overflowY="auto"
                              userSelect="none"
                            >
                              {ApplicationList?.map(({ name, id }, index) => {
                                return (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    display="flex"
                                    onClick={() => {
                                      setSocialHandle((prev) => {
                                        const copy = [...prev]
                                        copy[6] = {
                                          handle7: {
                                            name: name,
                                            handle:
                                              copy[6]?.handle7?.handle || '',
                                          },
                                        }
                                        return copy
                                      })
                                    }}
                                  >
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      px="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      borderRadius="md"
                                      _hover={{ bg: '#676D9A4D' }}
                                      ml=".4rem"
                                    >
                                      <Text color="white" ml=".6rem">
                                        {name}
                                      </Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box width="full">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Enter user handle
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Enter your userhandle to connect your account."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box mb="1rem" mt="0.3rem">
                          <Input
                            value={socialHandle[6]?.handle7?.handle}
                            onChange={(e) => {
                              setSocialHandle((prev) => {
                                const copy = [...prev]
                                copy[6] = {
                                  handle7: {
                                    name: copy[6]?.handle7?.name || '',
                                    handle: e.target.value,
                                  },
                                }
                                return copy
                              })
                            }}
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                          />
                        </Box>
                      </Box>

                      <Box
                        mt=".3rem"
                        display="flex"
                        alignItems="center"
                        gap=".5rem"
                      >
                        <Button
                          backgroundColor="#676D9A1A"
                          border="1px solid #676D9A4D"
                          _hover={{ backgroundColor: 'transparent' }}
                          color="#f2f2f2"
                          onClick={() => {
                            count > 1 && setCount(count - 1)
                          }}
                          isDisabled={count === 1}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                              stroke="#F0F0F5"
                              stroke-width="1.31"
                              stroke-linecap="round"
                            />
                          </svg>
                        </Button>
                        {/* <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button> */}
                      </Box>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap=".8rem"
                    mt=".8rem"
                  >
                    <Button
                      backgroundColor="transparent"
                      border="1px solid #676D9A4D"
                      _hover={{ backgroundColor: '#676D9A1A' }}
                      color="#f2f2f2"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      width="16rem"
                      height="2.3rem"
                      alignSelf="flex-start"
                      onClick={() => {
                        count < 7 && setCount(count + 1)
                      }}
                      _disabled={{ opacity: '0.5', cursor: 'not-allowed' }}
                      isDisabled={count >= 7}
                    >
                      <svg
                        style={{ marginRight: '.3rem' }}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6L12 12M12 12V18M12 12H18M12 12H6"
                          stroke="#F0F0F5"
                          stroke-width="1.37"
                          stroke-linecap="round"
                        />
                      </svg>
                      <Text fontSize="14px">Connect Another Account</Text>
                    </Button>

                    <Button
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      color="#6E7681"
                      size="sm"
                      width="16rem"
                      height="2.3rem"
                      _hover={{ color: 'black', backgroundColor: 'white' }}
                      _disabled={{ opacity: '0.5', cursor: 'not-allowed' }}
                      alignSelf="flex-start"
                      onClick={handleRegisterSubmit}
                      isDisabled={isDisabled()}
                    >
                      Submit
                    </Button>
                  </Box>
                </Card>
                {userSocialsData.length > 0 && (
                  <Card
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    p="1rem"
                    mt="1rem"
                  >
                    <Box display="flex" alignItems="center" gap="1rem">
                      <Box minWidth="277px">
                        <Box
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          userSelect="none"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Your Registered Applications
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Applications you have already registered with"
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" gap="0.5rem" mt="1rem">
                      {extractInstagramUsernames(userSocialsData).length >
                        0 && <RegisteredInstagramLogo />}
                      {extractLinkedInUsernames(userSocialsData).length > 0 && (
                        <RegisteredLinkedinLogo />
                      )}
                      {extractYoutubeUsernames(userSocialsData).length > 0 && (
                        <RegisteredYoutubeLogo />
                      )}
                      {extractTikTokUsernames(userSocialsData).length > 0 && (
                        <RegisteredTikTokIcon />
                      )}
                      {extractMediumUsernames(userSocialsData).length > 0 && (
                        <RegisteredMediumIcon />
                      )}
                      {extractTwitterUsernames(userSocialsData).length > 0 && (
                        <RegisteredTwitterIcon />
                      )}
                    </Box>
                  </Card>
                )}
              </ModalBody>
            ) : (
              <Box
                width="full"
                height="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt="3rem"
                mb="4rem"
              >
                <Spinner color="white" size="xl" />
              </Box>
            )}
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  )
}

export default RegisterCCPModal
