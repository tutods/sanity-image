// Big thank you to Ben Ilegbodu for writing this up. It's not the first place
// I've seen this, but it was so cogent and clear that it made this code better
// than it otherwise would have been. 🙏
//
// If you want to understand this code and you are not a TS jedi, check out Ben’s
// excellent write up on the topic, from which I shamelessly copied 100% of this
// code. I actually [mostly] understand it, and you can too! 🤓
//
// https://www.benmvp.com/blog/polymorphic-react-components-typescript/

// Orig source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
import type { Component, JSX, ValidComponent } from 'solid-js';

export type PropsOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

type PolymorphicAttributes<T extends ValidComponent> = {
  as?: T | keyof JSX.HTMLElementTags;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<ExtendedProps = object, OverrideProps = object> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<C extends JSX.Element, Props = object> = ExtendableProps<
  PropsOf<C>,
  Props
>;

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
  C extends ValidComponent,
  Props = object,
> = InheritableElementProps<C, Props & PolymorphicAttributes<C>>;

export type { PolymorphicAttributes };
