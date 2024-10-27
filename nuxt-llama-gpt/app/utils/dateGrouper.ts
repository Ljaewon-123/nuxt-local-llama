interface TitleType {
  _id: string
  title: string
  updatedAt: string // Date 
}

export class DateGrouper {
  private now: Date;

  constructor() {
    this.now = new Date();
  }

  private isToday(date: Date): boolean {
    const today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    return date >= today;
  }

  private isYesterday(date: Date): boolean {
    const yesterday = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 1);
    return date >= yesterday && date < new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  }

  private isThreeDaysAgo(date: Date): boolean {
    const threeDaysAgo = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 3);
    return date >= threeDaysAgo && date < new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 1);
  }

  private isSevenDaysAgo(date: Date): boolean {
    const sevenDaysAgo = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 7);
    return date >= sevenDaysAgo && date < new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 3);
  }

  private isThirtyDaysAgo(date: Date): boolean {
    const thirtyDaysAgo = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 30);
    return date >= thirtyDaysAgo && date < new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 7);
  }

  private isWithinSameMonth(date: Date): boolean {
    return date.getFullYear() === this.now.getFullYear() && date.getMonth() === this.now.getMonth();
  }

  private isWithinSameYear(date: Date): boolean {
    return date.getFullYear() === this.now.getFullYear();
  }

  public splitTitlesByDate(titles: TitleType[]) {
    const grouped = {
      today: [] as TitleType[],
      yesterday: [] as TitleType[],
      threeDaysAgo: [] as TitleType[],
      sevenDaysAgo: [] as TitleType[],
      thirtyDaysAgo: [] as TitleType[],
      pastMonths: {} as Record<string, TitleType[]>, // Grouped by month
      pastYears: {} as Record<number, TitleType[]>,  // Grouped by year
    };

    titles.forEach((title) => {
      const updatedAtDate = new Date(title.updatedAt);

      if (this.isToday(updatedAtDate)) {
        grouped.today.push(title);
      } else if (this.isYesterday(updatedAtDate)) {
        grouped.yesterday.push(title);
      } else if (this.isThreeDaysAgo(updatedAtDate)) {
        grouped.threeDaysAgo.push(title);
      } else if (this.isSevenDaysAgo(updatedAtDate)) {
        grouped.sevenDaysAgo.push(title);
      } else if (this.isThirtyDaysAgo(updatedAtDate)) {
        grouped.thirtyDaysAgo.push(title);
      } else if (this.isWithinSameYear(updatedAtDate)) {
        const month = updatedAtDate.toLocaleString('default', { month: 'long' });
        const monthKey = `${updatedAtDate.getFullYear()}-${month}`;
        if (!grouped.pastMonths[monthKey]) {
          grouped.pastMonths[monthKey] = [];
        }
        grouped.pastMonths[monthKey].push(title);
      } else {
        const year = updatedAtDate.getFullYear();
        if (!grouped.pastYears[year]) {
          grouped.pastYears[year] = [];
        }
        grouped.pastYears[year].push(title);
      }
    });

    return grouped;
  }
}
