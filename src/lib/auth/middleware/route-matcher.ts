export class RouteMatcher {
  static match(pathname: string, patterns: string[]): boolean {
    return patterns.some((pattern) => this.matchPattern(pathname, pattern));
  }

  static matchPattern(pathname: string, pattern: string): boolean {
    // convert pattern to regex
    const regex = this.patternToRegex(pattern);
    return regex.test(pathname);
  }

  static extractParams(
    pathname: string,
    pattern: string
  ): Record<string, string> {
    const regex = this.patternToRegex(pattern, true);
    const match = pathname.match(regex);

    if (!match) return {};

    const params: Record<string, string> = {};
    const paramNames = this.extractParamNames(pattern);

    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  }

  private static patternToRegex(
    pattern: string,
    capture: boolean = false
  ): RegExp {
    //NOTE: replace :param with regex group
    let regexPattern = pattern
      .replace(/:[^/]+/g, capture ? '([^/]+)' : '[^/]+')
      .replace(/\*/g, '.*');

    //INFO: add start and end anchors
    regexPattern = `^${regexPattern}$`;

    return new RegExp(regexPattern);
  }

  private static extractParamNames(pattern: string): string[] {
    const matches = pattern.match(/:[^/]+/g);
    return matches ? matches.map((match) => match.substring(1)) : [];
  }

  static isDynamicRoute(pattern: string): boolean {
    return pattern.includes(':') || pattern.includes('*');
  }

  static getRouteCategory(
    pathname: string,
    routeConfig: Record<string, string[]>
  ): string | null {
    for (const [category, patterns] of Object.entries(routeConfig)) {
      if (this.match(pathname, patterns)) {
        return category;
      }
    }
    return null;
  }
}
