export interface UseCase<Request, Response> {
  execute(reqData: Request): Promise<Response>;
}
