import { type LinkComponent, createLink } from "@tanstack/react-router";
import * as React from "react";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
    (props, ref) => {
        return (
            <a
                ref={ref}
                {...props}
                className={
                    "bg-black hover:bg-primary  text-text hover:text-black rounded-md px-3 py-2 text-sm font-semibold"
                }
            />
        );
    },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const Link: LinkComponent<typeof BasicLinkComponent> = (props) => {
    return <CreatedLinkComponent preload={"intent"} {...props} />;
};
