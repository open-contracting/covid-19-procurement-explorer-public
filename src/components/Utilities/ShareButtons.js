import React from 'react'
import { T } from '@transifex/react'
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    EmailShareButton
} from 'react-share'
import { twitterHandle } from '../../helpers/general'
import socialIcons from '../../assets/img/icons/social'

const ShareButtons = (props) => {
    const { url = window.location.href } = props

    return (
        <div className="flex flex-wrap">
            <p className="w-full font-bold opacity-40 mb-2">
                <T _str="Share on" />
            </p>
            <div className="flex">
                <FacebookShareButton url={url} className="social-icon">
                    <socialIcons.fbIcon />
                </FacebookShareButton>

                <TwitterShareButton
                    url={url}
                    via={twitterHandle}
                    className="social-icon">
                    <socialIcons.twitterIcon />
                </TwitterShareButton>

                <LinkedinShareButton url={url} className="social-icon">
                    <socialIcons.linkedIcon />
                </LinkedinShareButton>

                <EmailShareButton url={url} className="social-icon">
                    <socialIcons.mailIcon />
                </EmailShareButton>
            </div>
        </div>
    )
}
export default ShareButtons
