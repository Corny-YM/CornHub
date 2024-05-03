import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Wow = ({ className }: Props) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn("w-full h-full", className)}
    >
      <g clipPath="url(#clip0_15251_63610)">
        <path
          d="M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z"
          fill="url(#paint0_linear_15251_63610)"
        />
        <path
          d="M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z"
          fill="url(#paint1_radial_15251_63610)"
        />
        <path
          d="M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z"
          fill="url(#paint2_radial_15251_63610)"
          fillOpacity=".8"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.6144 10.8866c.159-1.8461 1.127-2.887 2.382-2.887 1.2551 0 2.2231 1.0418 2.3822 2.887.1591 1.8461-.7342 3.1127-2.3821 3.1127-1.648 0-2.5412-1.2666-2.3821-3.1127Z"
          fill="#4B280E"
        />
        <ellipse
          cx="11.1978"
          cy="5.6997"
          rx="1.3999"
          ry="1.6999"
          fill="#1C1C1D"
        />
        <ellipse
          cx="4.7979"
          cy="5.6997"
          rx="1.3999"
          ry="1.6999"
          fill="#1C1C1D"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.3528 3.166a1.4744 1.4744 0 0 0-1.8591-.3279.4.4 0 1 1-.3976-.6941c.9527-.5457 2.1592-.333 2.8678.5056a.4.4 0 0 1-.6111.5163ZM5.4998 2.8381a1.4744 1.4744 0 0 0-1.859.3278.4.4 0 0 1-.6111-.5162c.7085-.8387 1.915-1.0514 2.8677-.5057a.4.4 0 0 1-.3976.6941Z"
          fill="#E0761A"
        />
      </g>
      <defs>
        <radialGradient
          id="paint1_radial_15251_63610"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 7.9992 -7.99863 0 7.9986 7.9992)"
        >
          <stop offset=".5637" stopColor="#FF5758" stopOpacity="0" />
          <stop offset="1" stopColor="#FF5758" stopOpacity=".1" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_15251_63610"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(45 -4.5262 10.9226) scale(10.1818)"
        >
          <stop stopColor="#FFF287" />
          <stop offset="1" stopColor="#FFF287" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="paint0_linear_15251_63610"
          x1="2.3979"
          y1="2.3999"
          x2="13.5973"
          y2="13.5993"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF287" />
          <stop offset="1" stopColor="#F68628" />
        </linearGradient>
        <clipPath id="clip0_15251_63610">
          <path fill="#fff" d="M-.002 0h15.9992v15.9992H-.002z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Wow;
