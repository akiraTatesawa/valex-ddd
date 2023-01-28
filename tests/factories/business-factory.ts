import { randText, randUuid } from "@ngneat/falso";
import { Factory } from "@core/app/factory";
import { Business } from "@domain/business/business";
import { VoucherType } from "../../src/shared/domain/voucher-type";

interface BusinessFactoryGenerateProps {
  id?: string;
  name?: string;
  type?: VoucherType;
}

export class BusinessFactory extends Factory<Business> {
  public generate({ ...props }: BusinessFactoryGenerateProps = {}): Business {
    const business = Business.create({
      name: randText({ charCount: 20 }),
      type: "education",
      id: randUuid(),
      ...props,
    });

    return business.value.getValue()!;
  }
}
