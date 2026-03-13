import {
  faBluesky,
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faMastodon,
  faReddit,
  faTiktok,
  faTwitch,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";

const platformIcons: Record<string, typeof faGithub> = {
  github: faGithub,
  linkedin: faLinkedin,
  twitter: faTwitter,
  youtube: faYoutube,
  instagram: faInstagram,
  discord: faDiscord,
  twitch: faTwitch,
  tiktok: faTiktok,
  mastodon: faMastodon,
  bluesky: faBluesky,
  reddit: faReddit,
  facebook: faFacebook,
};

/**
 * Interface for the properties of the SocialIcon component.
 */
interface SocialIconProps {
  /** The URL that the icon links to. */
  url: string;
  /** The platform name (github, linkedin, twitter, etc.) */
  platform: string;
  /** The alternative text for accessibility. */
  alt: string;
}

/**
 * A React component that renders a social icon as a clickable FontAwesome icon link.
 */
export default function SocialIcon(props: SocialIconProps): JSX.Element {
  const icon = platformIcons[props.platform.toLowerCase()] || faGlobe;

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      aria-label={props.alt}
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
}
