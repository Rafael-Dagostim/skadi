import Charts from "react-apexcharts";

export function Dashboard({ options, series }: any) {
  return (
    <Charts
      options={options}
      series={series}
      type="line"
      height={'100%'}
      width={ '95%'}
    />
  );
}
