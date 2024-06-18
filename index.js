const Trigger = require("@saltcorn/data/models/trigger");

const configuration_workflow = () => {
  const cfg_base_url = getState().getConfig("base_url");

  return new Workflow({
    steps: [
      {
        name: "in-app purchase configuration",
        form: () =>
          new Form({
            fields: [
              {
                name: "foo",
                label: "bar",
                type: "String",
                required: false,
              },
            ],
          }),
      },
    ],
  });
};

const callValidatePurchase = async() => {
//  axios.post(`${cfg_base_url}/plugins/in-app-purchases/validate_purchase`, {
};

const actions = () => {
  console.log("actions");
  return {
    purchase_product: {
      desccription: "Purchase a product",
      configFields: async ({ table }) => {
        const trigger = Trigger.find();
        const fields = table ? await table.getFields() : [];
        return [
          {
            name: "product_id_field",
            label: "Product ID field",
            type: "String",
            sublabel: "A String field containing the product ID",
            required: true,
            attributes: {
              options: fields
                .filter((f) => f.type?.name === "String")
                .map((f) => f.name),
            },
          },
          {
            name: "product_type_field",
            label: "Product Type field",
            type: "String",
            sublabel: "A String field containing the product type",
            required: true,
            attributes: {
              options: fields
                .filter((f) => f.type?.name === "String")
                .map((f) => f.name),
            },
          },
          {
            name: "platform_field",
            label: "Platform field",
            type: "String",
            sublabel: "A String field containing the platform",
            required: true,
            attributes: {
              options: fields
                .filter((f) => f.type?.name === "String")
                .map((f) => f.name),
            },
          },
          {
            name: "action_on_done_id",
            label: "Action on done",
            type: "String",
            required: false,
            sublabel: "The action to execute after the purchase is done",
            attributes: {
              options: trigger
                .filter((t) => t.name)
                .map((t) => ({
                  name: t.id,
                  label: t.name,
                })),
            },
          },
        ];
      },
      run: async ({
        table,
        req,
        user,
        row,
        configuration: {
          product_id_field,
          product_type_field,
          platform_field,
          action_on_done_id,
        },
      }) => {
        const product_id = row[product_id_field];
        const product_type = row[product_type_field];
        const platform = row[platform_field];
        console.log(product_id, product_type, platform, action_on_done_id);
        const trigger = Trigger.findOne({ id: action_on_done_id });
        console.log(trigger);
        // const { store, ProductType, Platform } = CdvPurchase;
        // const product = store.get("my_test_produkt_id", Platform.APPLE_APPSTORE);

        await callValidatePurchase();

        return "purchase_product";
      },
    },
  };
};

const routes = (config) => {
  return [
    {
      method: "post",
      url: "/validate_purchase",
      callback: async ({req, res}) => {
        console.log("validate_purchase");
        res.status(200).json({ success: true });
      },
    }

  ]
};

module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "in-app-purchases",
  configuration_workflow,
  routes,
  actions,
};
