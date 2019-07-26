import ShaderLib, { ShaderType } from './ShaderLib';
import CustomMaterial from "./CustomMaterial";


export default class ShaderManager {
    /**
     * 获取一个材质
     * @param sprite 精灵 
     * @param shader shader类型
     */
    static getMaterial(sprite: cc.Sprite, shaderID: ShaderType): CustomMaterial {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.warn("Shader not surpport for canvas");
            return;
        }
        if (!sprite || !sprite.spriteFrame) {
            return;
        }
        if (shaderID > ShaderType.Gray) {
            let name = ShaderType[shaderID];
            let shader = ShaderLib.getInstance().getShader(name)//根据名称获取对应的shader
            // console.log(shader)
            cc.dynamicAtlasManager.enabled = false;
            let material = CustomMaterial.getInstance().initWithName(name, shader.params);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            let sp = sprite as any;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            // 系统自带normal和gray
            sprite.setState(shaderID + 2);
        }
    }
}