import { toSvg } from "jdenticon";

const Identicon = ({ hash, size = 64 }: { hash: string; size?: number }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: toSvg(hash, size),
      }}
    ></div>
  );
};
export default Identicon;
