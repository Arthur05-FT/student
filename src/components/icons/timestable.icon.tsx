type CalendarCheckIconProps = {
  size: string;
};

const CalendarCheckIcon = ({ size }: CalendarCheckIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M17 4.625H7a4 4 0 0 0-4 4v8.75a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-8.75a4 4 0 0 0-4-4m-14 5h18m-4-7v4m-10-4v4" />
      <path d="m9 14.714l1.689 1.689a.639.639 0 0 0 .908 0L15 13" />
    </g>
  </svg>
);

export default CalendarCheckIcon;
