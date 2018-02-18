
export class DirectionIndex {
  static getDirectionName(abbreviation: string) {
    let testAbbrev = abbreviation;

    if (testAbbrev) {
      testAbbrev = testAbbrev.toLowerCase();
      if (testAbbrev.length > 1) {
        testAbbrev = testAbbrev[0];
      }
    }

    switch (testAbbrev) {
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