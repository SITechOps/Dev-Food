import { Line } from 'rc-progress';

interface BarraProgressoProps {
  progress: number;
}

const BarraProgresso: React.FC<BarraProgressoProps> = ({ progress }) => {
  return (
    <>
      <Line
        percent={progress}
        strokeWidth={2}
        strokeColor="#ee4c58"
        trailColor="#fac8cb"
      />
    </>
  );
};

export default BarraProgresso;
