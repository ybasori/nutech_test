declare module "*.svg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
// declaration.d.ts
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
// declaration.d.ts
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}
