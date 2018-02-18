
export class DirectionIndex {
  static getDirectionName(abbreviation: string) {
    switch (abbreviation) {
      case 'n':
        return 'north';
      case 's':
        return 'south';
      case 'e':
        return 'east';
      case 'w':
        return 'west';
      case 'u':
        return 'up';
      case 'd':
        return 'down';
      default:
        return 'unknown';
    }
  }
}