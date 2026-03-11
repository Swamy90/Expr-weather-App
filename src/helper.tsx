import dayjs from "dayjs";

export const getNextFiveDaysForecast = (list: any[]) => {
    const today = dayjs().format("YYYY-MM-DD");
    const grouped: any = {};
  
    list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = item;
    });
  
    return Object.keys(grouped)
      .filter(date => date !== today)
      .slice(0, 5)
      .map(date => grouped[date]);
  };