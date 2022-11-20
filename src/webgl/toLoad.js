import Loader from "@/webgl/utils/loader";

const P = '/webgl/'

export default [
	{
		name: 'player',
		type: Loader.TYPES.MODEL,
		path: P + 'player.glb'
	},
	{
		name: 'enemy',
		type: Loader.TYPES.MODEL,
		path: P + 'player.glb'
	},
	{
		name: 'full',
		type: Loader.TYPES.MODEL,
		path: P + 'full_tile.glb'
	},
	{
		name: 'half',
		type: Loader.TYPES.MODEL,
		path: P + 'half_tile.glb'
	},
	{
		name: 'quarter',
		type: Loader.TYPES.MODEL,
		path: P + 'quarter_tile.glb'
	},
	{
		name: 'quarter_empty',
		type: Loader.TYPES.MODEL,
		path: P + 'quarter_empty_tile.glb'
	},
]