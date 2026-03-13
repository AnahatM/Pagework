import LinkButton from "@components/ui/LinkButton";
import SizedBox from "@components/utils/SizedBox";
import type { JSX } from "react";
import "./NotFound.css";

/**
 * Renders a "Page Not Found" view when the route does not match any valid page.
 *
 * @returns {JSX.Element} The Not Found page component.
 */
export default function NotFound(): JSX.Element {
  return (
    // Main container for the Not Found content
    <div className="not-found-container">
      {/* Spacer to push content down from navbar */}
      <SizedBox height={50} />

      {/* Panel containing the Not Found message */}
      <div className="not-found-panel">
        <h2>Something went wrong</h2>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist.</p>
        <p>
          Please check the URL or return to the homepage. Check the browse section for all options.
        </p>

        {/* Spacer before main button*/}
        <SizedBox height={10} />

        {/* Button to navigate back to homepage */}
        <LinkButton
          href={"/"}
          linktext={"Go to Homepage"}
          backgroundType={"primary"}
          fontType="display"
          outlineType="none"
          openInNewTab={false}
        />
      </div>
    </div>
  );
}
