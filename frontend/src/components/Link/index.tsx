import { forwardRef, ButtonHTMLAttributes } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

interface NextLinkComposedProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as'> {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
  href?: NextLinkProps['href'];
}

export const NextLinkComposed = forwardRef<HTMLButtonElement, NextLinkComposedProps>(
  function NextLinkComposed (props, ref) {
    const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
      >
        <button ref={ref} {...other} />
      </NextLink>
    );
  }
);
