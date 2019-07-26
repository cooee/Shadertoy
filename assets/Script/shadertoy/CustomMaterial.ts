// @ts-ignore
const math = cc.vmath;
const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;

export default class CustomMaterial extends Material {
    private static instance: CustomMaterial = null;
    constructor() {
        super(false);
    }

    public static getInstance(): CustomMaterial {
        if (!this.instance) {
            this.instance = new CustomMaterial();
        }
        // this.instance.initWithName(shaderName, params)
        return this.instance;
    }

    public initWithName(shaderName: string, params?: any | void) {
        let renderer = renderEngine.renderer;
        let gfx = renderEngine.gfx;
        console.log(shaderName, "shaderName")
        let pass = new renderer.Pass(shaderName);
        console.log(pass)
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
        );

        let techParams = [
            { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
            { name: 'num', type: renderer.PARAM_FLOAT },
        ];

        if (params) techParams = techParams.concat(params);
        console.log(techParams, "techParams")

        let mainTech = new renderer.Technique(
            ['transparent'],
            techParams,
            [pass]
        );


        // @ts-ignore
        this._texture = null;
        // @ts-ignore
        this._num = 0.0;


        // @ts-ignore 初始化数据
        this._effect = this.effect = new renderer.Effect(
            [
                mainTech
            ],
            {
                'num': this._num,
            },
            []
        );
        // @ts-ignore
        this._mainTech = mainTech;

        return this;
    }

    setTexture(texture) {
        if (this._texture !== texture) {
            // @ts-ignore
            this._texture = texture;
            this._texture.update({
                // 有时候需要反转y轴
                flipY: false,
                // 多级渐进纹理
                mipmap: true
            });
            this._effect.setProperty('texture', texture.getImpl());
            this._texIds['texture'] = texture.getId();
        }
    }

    setNum(num) {
        // @ts-ignore
        this._num = num;
        this._effect.setProperty('num', this._num);
    }

    // 设置自定义参数的值
    setParamValue = function (name, value) {
        this._effect.setProperty(name, value);
        return this;
    };

}