interface ValueObjectProps {
  [value: string]: any;
}

export abstract class ValueObject<Props extends ValueObjectProps> {
  protected readonly props: Props;

  constructor(props: Props) {
    this.props = props;
  }
}
