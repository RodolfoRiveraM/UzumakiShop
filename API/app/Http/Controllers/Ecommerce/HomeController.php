<?php

namespace App\Http\Controllers\Ecommerce;

use Carbon\Carbon;
use App\Models\Slider;
use App\Models\Sale\Review;
use Illuminate\Http\Request;
use App\Models\Product\Brand;
use App\Models\Product\Product;
use App\Models\Discount\Discount;
use App\Models\Product\Categorie;
use App\Models\Product\Propertie;
use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceResource;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceCollection;

class HomeController extends Controller
{
    //

    public function home(Request $request) {
        $sliders_principal = Slider::where("state",1)->where("type_slider",1)->orderBy("id","desc")->get();
        
        // ->orderBy("id","desc")
        $categories_randoms = Categorie::withCount(["product_categorie_firsts"])
                            ->where("categorie_second_id",NULL)
                            ->where("categorie_third_id",NULL)
                            ->inRandomOrder()->limit(5)->get();
        

        $product_tranding_new = Product::where("state",2)->inRandomOrder()->limit(16)->get();
        $product_tranding_featured = Product::where("state",2)->inRandomOrder()->limit(16)->get();
        $product_tranding_top_sellers = Product::where("state",2)->inRandomOrder()->limit(16)->get();

        $sliders_secundario = Slider::where("state",1)->where("type_slider",2)->orderBy("id","asc")->get();

        $product_electronics = Product::where("state",2)->where("categorie_first_id",1)->inRandomOrder()->limit(6)->get();

        $products_carusel = Product::where("state",2)->whereIn("categorie_first_id",$categories_randoms->pluck("id"))->orderBy("created_at", "desc")->get();
        $sliders_products = Slider::where("state",1)->where("type_slider",3)->orderBy("id","asc")->get();

        $product_last_discounts = Product::where("state",2)->inRandomOrder()->limit(3)->get();
        $product_last_featured = Product::where("state",2)->inRandomOrder()->limit(3)->get();
        $product_last_selling = Product::where("state",2)->inRandomOrder()->limit(3)->get();


        date_default_timezone_set("America/Lima");
        $DISCOUNT_FLASH = Discount::where("type_campaing",2)->where("state",1)
                            ->where("start_date","<=",today())
                            ->where("end_date",">=",today())
                            ->first();

        $DISCOUNT_FLASH_PRODUCTS = collect([]);

        if($DISCOUNT_FLASH){
            foreach ($DISCOUNT_FLASH->products as $key => $aux_product) {
                $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($aux_product->product));
            }
            foreach ($DISCOUNT_FLASH->categories as $key => $aux_categorie) {
                $products_of_categories = Product::where("state",2)->where("categorie_first_id",$aux_categorie->categorie_id)->get();
                foreach ($products_of_categories as $key => $product) {
                    $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }
            foreach ($DISCOUNT_FLASH->brands as $key => $aux_brand) {
                $products_of_brands = Product::where("state",2)->where("brand_id",$aux_brand->brand_id)->get();
                foreach ($products_of_brands as $key => $product) {
                    $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }
            // Sep 30 2024 20:20:22
            $DISCOUNT_FLASH->end_date_format = Carbon::parse($DISCOUNT_FLASH->end_date)->addDays(1)->format('M d Y H:i:s');
        }

        return response()->json([
            "sliders_principal" => $sliders_principal->map(function($slider) {
                return [
                    "id" => $slider->id,
                    "title"  => $slider->title,
                    "subtitle"  => $slider->subtitle,
                    "label"  => $slider->label,
                    "imagen"  => $slider->imagen ? env("APP_URL")."storage/".$slider->imagen : NULL,
                    "link"  => $slider->link,
                    "state"  => $slider->state,
                    "color"  => $slider->color,
                    "type_slider"  => $slider->type_slider,
                    "price_original"  => $slider->price_original,
                    "price_campaing" => $slider->price_campaing,
                ];
            }),
            "categories_randoms" => $categories_randoms->map(function($categorie) {
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "products_count" => $categorie->product_categorie_firsts_count,
                    "imagen" => env("APP_URL")."storage/".$categorie->imagen, 
                ];
            }),
            "product_tranding_new" => ProductEcommerceCollection::make($product_tranding_new),
            "product_tranding_featured" => ProductEcommerceCollection::make($product_tranding_featured),
            "product_tranding_top_sellers" => ProductEcommerceCollection::make($product_tranding_top_sellers),
            "sliders_secundario" => $sliders_secundario->map(function($slider) {
                return [
                    "id" => $slider->id,
                    "title"  => $slider->title,
                    "subtitle"  => $slider->subtitle,
                    "label"  => $slider->label,
                    "imagen"  => $slider->imagen ? env("APP_URL")."storage/".$slider->imagen : NULL,
                    "link"  => $slider->link,
                    "state"  => $slider->state,
                    "color"  => $slider->color,
                    "type_slider"  => $slider->type_slider,
                    "price_original"  => $slider->price_original,
                    "price_campaing" => $slider->price_campaing,
                ];
            }),
            "product_electronics" => ProductEcommerceCollection::make($product_electronics),
            "products_carusel" => ProductEcommerceCollection::make($products_carusel),
            "sliders_products" => $sliders_products->map(function($slider) {
                return [
                    "id" => $slider->id,
                    "title"  => $slider->title,
                    "subtitle"  => $slider->subtitle,
                    "label"  => $slider->label,
                    "imagen"  => $slider->imagen ? env("APP_URL")."storage/".$slider->imagen : NULL,
                    "link"  => $slider->link,
                    "state"  => $slider->state,
                    "color"  => $slider->color,
                    "type_slider"  => $slider->type_slider,
                    "price_original"  => $slider->price_original,
                    "price_campaing" => $slider->price_campaing,
                ];
            }),
            "product_last_discounts" => ProductEcommerceCollection::make($product_last_discounts),
            "product_last_featured" => ProductEcommerceCollection::make($product_last_featured),
            "product_last_selling" => ProductEcommerceCollection::make($product_last_selling),
            "discount_flash" => $DISCOUNT_FLASH,
            "discount_flash_products" =>$DISCOUNT_FLASH_PRODUCTS,
        ]);
    }

    public function categoria(Request $request, $slug) {
        $categories_menus = Categorie::where("id",$slug)->get();
        $product_categorie = Product::where("categorie_first_id", $slug)->orWhere("categorie_second_id", $slug)->orWhere("categorie_third_id", $slug)->inRandomOrder()->limit(60)->get();

        return response()->json([
            "message" => 200,
            "categoria" => $categories_menus[0],
            "product_categorie" => ProductEcommerceCollection::make($product_categorie),
        ]);
    }

    public function menus(){
        $categories_menus = Categorie::where("categorie_second_id",NULL)
                            ->where("categorie_third_id",NULL)
                            ->orderBy("position","desc")
                            ->get();

        return response()->json([
            "categories_menus" => $categories_menus->map(function($departament) {
                return [
                    "id" => $departament->id,
                    "name" => $departament->name,
                    "icon" => $departament->icon,
                    "categories" => $departament->categorie_seconds->map(function($categorie) {
                        return [
                            "id" => $categorie->id,
                            "name" => $categorie->name,
                            "imagen" => $categorie->imagen ? env("APP_URL")."storage/".$categorie->imagen : NULL,
                            "subcategories" => $categorie->categorie_seconds->map(function($subcategorie) {
                                return  [
                                    "id" => $subcategorie->id,
                                    "name" => $subcategorie->name,
                                    "imagen" => $subcategorie->imagen ? env("APP_URL")."storage/".$subcategorie->imagen : NULL, 
                                ];
                            })
                        ];
                    })
                ];
            }),
        ]);
    }

    public function show_product(Request $request,$slug){
        $campaing_discount = $request->get("campaing_discount");
        $discount = null;
        if($campaing_discount){
            $discount = Discount::where("code",$campaing_discount)->first();
        }
        $product = Product::where("slug",$slug)->where("state",2)->first();

        if(!$product){
            return response()->json([
                "message" => 403,
                "message_text" => "EL PRODUCTO NO EXISTE" 
            ]);
        }

        $product_relateds = Product::where("categorie_first_id",$product->categorie_first_id)->where("state",2)->get();

        $reviews = Review::where("product_id",$product->id)->get();
        return response()->json([
            "message" => 200,
            "product" => ProductEcommerceResource::make($product),
            "product_relateds" => ProductEcommerceCollection::make($product_relateds),
            "discount_campaing" => $discount,
            "reviews" => $reviews->map(function($review) {
                return [
                    "id" => $review->id,
                    "user" => [
                        "full_name" => $review->user->name . ' '. $review->user->surname,
                        'avatar' => $review->user->avatar ? env("APP_URL")."storage/".$review->user->avatar : 'https://cdn-icons-png.flaticon.com/512/1476/1476614.png',
                    ],
                    "message" => $review->message,
                    "rating" => $review->rating,
                    "created_at" => $review->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    public function config_filter_advance() {
        $categories = Categorie::withCount(["product_categorie_secodns"])
                        ->whereNotNull("categorie_second_id")
                        ->whereNull("categorie_third_id")
                        ->get();

        $brands = Brand::withCount(["products"])->where("state",1)->get();

        $colors = Propertie::where("code","<>",NULL)->get();

        $product_relateds = Product::where("state",2)->inRandomOrder()->limit(4)->get();
        return response()->json([
            "categories" => $categories->map(function($categorie) {
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "products_count" => $categorie->product_categorie_secodns_count,
                    "imagen" => env("APP_URL")."storage/".$categorie->imagen, 
                ];
            }),
            "brands" => $brands->map(function($brand) {
                return [
                    "id" => $brand->id,
                    "name" => $brand->name,
                    "products_count" => $brand->products_count,
                ];
            }),
            "colors" => $colors->map(function($color) {
                $color->products_count = $color->variations->unique("product_id")->count();
                return $color;
            }),
            "product_relateds" => ProductEcommerceCollection::make($product_relateds),
        ]);
    }

    public function filter_advance_product(Request $request) {

        $categories_selected = $request->categories_selected;
        $colors_selected = $request->colors_selected;
        $brands_selected = $request->brands_selected;
        $min_price = $request->min_price;
        $max_price = $request->max_price;
        $currency = $request->currency;
        $options_aditional = $request->options_aditional;
        $search = $request->search;

        $colors_product_selected = [];
        if($colors_selected && sizeof($colors_selected) > 0){
            $properties = Propertie::whereIn("id",$colors_selected)->get();
            foreach ($properties as $propertie) {
                foreach ($propertie->variations as $variation) {
                    array_push($colors_product_selected,$variation->product_id);
                }
            }
        }
        $product_general_ids_array = [];
        if($options_aditional && sizeof($options_aditional) > 0 && in_array("campaing",$options_aditional)){
            date_default_timezone_set("America/Lima");
            $discount = Discount::where("type_campaing",1)->where("state",1)
                        ->where("start_date","<=",today())
                        ->where("end_date",">=",today())
                        ->first();
            if($discount){
                foreach ($discount->products as $product_aux) {
                   array_push($product_general_ids_array,$product_aux->product_id);
                }
                foreach ($discount->categories as $categorie_aux) {
                    array_push($categories_selected,$categorie_aux->categorie_id);
                }
                foreach ($discount->brands as $brand_aux) {
                    array_push($brands_selected,$brand_aux->brand_id);
                }
            }
        }

        $products = Product::filterAdvanceEcommerce($categories_selected,$colors_product_selected,
        $brands_selected,$min_price,$max_price,$currency,$product_general_ids_array,$options_aditional,$search)->orderBy("id","desc")->get();

        return response()->json([
            "products" => ProductEcommerceCollection::make($products)
        ]);
    }

    public function campaing_discount_link(Request $request) {
        $code_discount = $request->code_discount;
        
        $is_exist_discount = Discount::where("code",$code_discount)->where("type_campaing",3)->where("state",1)->first();
        if(!$is_exist_discount){
            return response()->json([
                "message" => 403,
                "message_text" => "El codigo de la campaña de descuento no existe"
            ]);
        }
        date_default_timezone_set("America/Lima");
        $DISCOUNT_LINK = Discount::where("code",$code_discount)
                                ->where("state",1)
                                ->where("type_campaing",3)
                                ->where("start_date","<=",today())
                                ->where("end_date",">=",today())
                                ->first();
        if(!$DISCOUNT_LINK){
            return response()->json([
                "message" => 403,
                "message_text" => "La campaña de descuento ya vencio"
            ]);
        }
        $DISCOUNT_LINK_PRODUCTS = collect([]);
        if($DISCOUNT_LINK){
            foreach ($DISCOUNT_LINK->products as $key => $aux_product) {
                $DISCOUNT_LINK_PRODUCTS->push(ProductEcommerceResource::make($aux_product->product));
            }
            foreach ($DISCOUNT_LINK->categories as $key => $aux_categorie) {
                $products_of_categories = Product::where("state",2)->where("categorie_first_id",$aux_categorie->categorie_id)->get();
                foreach ($products_of_categories as $key => $product) {
                    $DISCOUNT_LINK_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }
            foreach ($DISCOUNT_LINK->brands as $key => $aux_brand) {
                $products_of_brands = Product::where("state",2)->where("brand_id",$aux_brand->brand_id)->get();
                foreach ($products_of_brands as $key => $product) {
                    $DISCOUNT_LINK_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }
            // Sep 30 2024 20:20:22
            $DISCOUNT_LINK->start_date_format = Carbon::parse($DISCOUNT_LINK->start_date)->format('Y/m/d');
            $DISCOUNT_LINK->end_date_format = Carbon::parse($DISCOUNT_LINK->end_date)->format('Y/m/d');
        }

        return response()->json([
            "discount" => $DISCOUNT_LINK,
            "products" => $DISCOUNT_LINK_PRODUCTS
        ]);
    }
}
