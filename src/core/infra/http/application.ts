export abstract class Application {
  protected abstract configMiddlewares(): void;
  public abstract init(): Promise<void>;
}
