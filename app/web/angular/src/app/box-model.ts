export class BoxModel {
  clientWidth: number;
  outerWidth: number;
  innerWidth: number;

  clientHeight: number;
  outerHeight: number;
  innerHeight: number;

  padding: { top: number, left: number, bottom: number, right: number };
  margin: { top: number, left: number, bottom: number, right: number };
  border: { top: number, left: number, bottom: number, right: number };

  horizontalPadding(): number {
    return this.padding.left + this.padding.right;
  }

  verticalPadding(): number {
    return this.padding.top + this.padding.bottom;
  }

  horizontalMargin(): number {
    return this.margin.left + this.margin.right;
  }

  verticalMargin(): number {
    return this.margin.top + this.margin.bottom;
  }

  horizontalBorder(): number {
    return this.border.left + this.border.right;
  }

  verticalBorder(): number {
    return this.border.top + this.border.bottom;
  }

  horizontalSpacing(): number {
    return this.horizontalBorder() + this.horizontalMargin() + this.horizontalPadding();
  }

  verticalSpacing(): number {
    return this.verticalBorder() + this.verticalMargin() + this.verticalPadding();
  }

  constructor(element) {
    const style = window.getComputedStyle(element);

    this.clientWidth = element.clientWidth;
    this.clientHeight = element.clientHeight;

    this.padding = {
      top: parseFloat(style.paddingTop),
      bottom: parseFloat(style.paddingBottom),
      left: parseFloat(style.paddingLeft),
      right: parseFloat(style.paddingRight)
    };

    this.margin = {
      top: parseFloat(style.marginTop),
      bottom: parseFloat(style.marginBottom),
      left: parseFloat(style.marginLeft),
      right: parseFloat(style.marginRight)
    };

    this.border = {
      top: parseFloat(style.borderTopWidth),
      bottom: parseFloat(style.borderBottomWidth),
      left: parseFloat(style.borderLeftWidth),
      right: parseFloat(style.borderRightWidth)
    };

    this.outerWidth = this.clientWidth - this.margin.left - this.margin.right;
    this.outerHeight = this.clientHeight - this.margin.top - this.margin.bottom;

    this.innerWidth = this.outerWidth - this.padding.left - this.padding.right  - this.border.left - this.border.right;
    this.innerHeight = this.outerHeight - this.padding.top - this.padding.bottom  - this.border.top - this.border.bottom;
  }
}
